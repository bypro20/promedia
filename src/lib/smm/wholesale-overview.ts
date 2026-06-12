import { prisma } from '@/lib/db'
import { ALL_SERVICES } from '@/lib/catalog'
import { formatCommissionPercent, getPaytrCommissionFixedTry, getPaytrCommissionRate } from '@/lib/paytr-commission'
import { calcProfitStats } from '@/lib/smm/auto-mapper'
import { smmCostTry } from '@/lib/smm/pricing-engine'
import { SMM_PANEL_PRESETS } from '@/lib/smm/providers'
import type { MarkupConfig, ServiceMapEntry } from '@/lib/smm/service-map-store'
import { isWholesaleProvider } from '@/lib/smm/wholesale'

export type ProviderBreakdownRow = {
  id: string
  name: string
  tier: 'wholesale' | 'reseller'
  mappedServices: number
  configured: boolean
  balance?: string
  currency?: string
  balanceOk: boolean
  error?: string
}

export type RecentOrderRow = {
  code: string
  status: string
  paymentStatus: string
  sellPrice: number
  amount: number
  estimatedCost: number | null
  profit: number | null
  marginPercent: number | null
  providerId: string
  providerName: string
  providerTier: 'wholesale' | 'reseller' | 'unknown'
  smmOrderId: string | null
  smmStatus: string | null
  createdAt: string
}

export type WholesaleOverview = {
  flow: Array<{ step: number; title: string; detail: string }>
  catalogStats: {
    mappedWholesale: number
    mappedReseller: number
    unmapped: number
    avgMarginPercent: number
    avgCostTry: number
    avgSellTry: number
    avgProfitTry: number
    lowMarginCount: number
  }
  providerBreakdown: ProviderBreakdownRow[]
  orderStats: {
    totalOrders: number
    paidOrders: number
    fulfilledOrders: number
    failedOrders: number
    revenueTry: number
    estimatedCostTry: number
    estimatedProfitTry: number
    avgMarginPercent: number
    wholesaleOrderCount: number
    resellerOrderCount: number
  }
  recentOrders: RecentOrderRow[]
  fees: {
    minProfitPercent: number
    usdTry: number
    preferWholesale: boolean
    autoCheapest: boolean
    paytrRateLabel: string
    paytrFixedTry: number
    paytrNote: string
    marginFormula: string
    example: { sellTry: number; costTry: number; profitTry: number; marginPercent: number }
  }
  demoMode: boolean
}

function providerTier(id: string): 'wholesale' | 'reseller' {
  const preset = SMM_PANEL_PRESETS.find((p) => p.id === id)
  if (preset?.providerTier) return preset.providerTier
  return isWholesaleProvider(id) ? 'wholesale' : 'reseller'
}

function providerName(id: string): string {
  return SMM_PANEL_PRESETS.find((p) => p.id === id)?.name ?? id
}

function estimateOrderCost(
  order: { serviceSlug: string; tierId: string; amount: number; price: number; smmCharge: number | null; smmProvider: string },
  map: Record<string, ServiceMapEntry>,
  markup: MarkupConfig
): { cost: number; providerId: string } | null {
  if (order.smmCharge != null && order.smmCharge > 0) {
    return { cost: order.smmCharge * markup.usdTry, providerId: order.smmProvider }
  }
  const entry = map[`${order.serviceSlug}:${order.tierId}`]
  if (!entry) return null
  return { cost: smmCostTry(entry.rate, order.amount, markup.usdTry), providerId: entry.providerId }
}

export async function buildWholesaleOverview(input: {
  map: Record<string, ServiceMapEntry>
  markup: MarkupConfig
  configuredIds: string[]
  balances: Array<{ id: string; name: string; balance?: string; currency?: string; ok: boolean; error?: string }>
  demoMode: boolean
}): Promise<WholesaleOverview> {
  const { map, markup, configuredIds, balances, demoMode } = input

  let mappedWholesale = 0
  let mappedReseller = 0
  let unmapped = 0
  let marginSum = 0
  let costSum = 0
  let sellSum = 0
  let profitSum = 0
  let mappedWithProfit = 0
  let lowMarginCount = 0

  for (const service of ALL_SERVICES) {
    for (const tier of service.tiers) {
      const entry = map[`${service.slug}:${tier.id}`]
      if (!entry) {
        unmapped++
        continue
      }
      if (providerTier(entry.providerId) === 'wholesale') mappedWholesale++
      else mappedReseller++

      const refPkg = tier.packages.find((p) => p.amount === 1000) ?? tier.packages[0]
      const stats = calcProfitStats(refPkg.price, entry.rate, refPkg.amount, markup.usdTry)
      marginSum += stats.margin
      costSum += stats.cost
      sellSum += refPkg.price
      profitSum += stats.profit
      mappedWithProfit++
      if (stats.margin < markup.minProfitPercent) lowMarginCount++
    }
  }

  const providerMappedCount = new Map<string, number>()
  for (const entry of Object.values(map)) {
    providerMappedCount.set(entry.providerId, (providerMappedCount.get(entry.providerId) ?? 0) + 1)
  }

  const providerBreakdown: ProviderBreakdownRow[] = SMM_PANEL_PRESETS.map((p) => {
    const bal = balances.find((b) => b.id === p.id)
    return {
      id: p.id,
      name: p.name,
      tier: p.providerTier ?? 'reseller',
      mappedServices: providerMappedCount.get(p.id) ?? 0,
      configured: configuredIds.includes(p.id),
      balance: bal?.balance,
      currency: bal?.currency,
      balanceOk: bal?.ok ?? false,
      error: bal?.error,
    }
  }).filter((p) => p.configured || p.mappedServices > 0)

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    where: { paymentStatus: 'paid' },
  })

  let revenueTry = 0
  let estimatedCostTry = 0
  let estimatedProfitTry = 0
  let orderMarginSum = 0
  let ordersWithCost = 0
  let fulfilledOrders = 0
  let failedOrders = 0
  let wholesaleOrderCount = 0
  let resellerOrderCount = 0
  const recentOrders: RecentOrderRow[] = []

  for (const o of orders) {
    revenueTry += o.price
    if (o.smmOrderId && !o.smmOrderId.startsWith('DEMO-')) fulfilledOrders++
    if (o.status === 'failed') failedOrders++

    const est = estimateOrderCost(o, map, markup)
    let profit: number | null = null
    let marginPercent: number | null = null
    let cost: number | null = null
    let pid = o.smmProvider !== 'default' ? o.smmProvider : est?.providerId ?? 'unknown'

    if (est) {
      cost = est.cost
      profit = o.price - est.cost
      marginPercent = o.price > 0 ? Math.round((profit / o.price) * 1000) / 10 : 0
      estimatedCostTry += est.cost
      estimatedProfitTry += profit
      orderMarginSum += marginPercent
      ordersWithCost++
      pid = est.providerId
    }

    const tier = providerTier(pid)
    if (tier === 'wholesale') wholesaleOrderCount++
    else if (pid !== 'unknown') resellerOrderCount++

    recentOrders.push({
      code: o.code,
      status: o.status,
      paymentStatus: o.paymentStatus,
      sellPrice: o.price,
      amount: o.amount,
      estimatedCost: cost,
      profit,
      marginPercent,
      providerId: pid,
      providerName: providerName(pid),
      providerTier: pid === 'unknown' ? 'unknown' : tier,
      smmOrderId: o.smmOrderId,
      smmStatus: o.smmStatus,
      createdAt: o.createdAt.toISOString(),
    })
  }

  const totalPaid = await prisma.order.count({ where: { paymentStatus: 'paid' } })
  const exampleCost = mappedWithProfit > 0 ? costSum / mappedWithProfit : 25
  const exampleSell = mappedWithProfit > 0 ? sellSum / mappedWithProfit : 89
  const exampleProfit = exampleSell - exampleCost
  const paytrRate = getPaytrCommissionRate()

  return {
    flow: [
      { step: 1, title: 'Müşteri bakiye yükler', detail: 'PayTR kart veya havale — komisyon müşteriye yansır.' },
      { step: 2, title: 'Satın alır', detail: 'Bakiyeden düşer; ödeme yoksa toptancıya gitmez.' },
      { step: 3, title: 'Toptancı API', detail: 'BulkFollows / SMMKings / SMMRaja → action=add ile otomatik sipariş.' },
      { step: 4, title: 'Toptan bakiye düşer', detail: 'Panelde USD varsa anında çekilir; yoksa bakiye yüklenince cron otomatik gönderir.' },
      { step: 5, title: 'Kar', detail: `Satış − maliyet (min. %${markup.minProfitPercent} marj).` },
    ],
    catalogStats: {
      mappedWholesale,
      mappedReseller,
      unmapped,
      avgMarginPercent: mappedWithProfit ? Math.round((marginSum / mappedWithProfit) * 10) / 10 : 0,
      avgCostTry: mappedWithProfit ? Math.round((costSum / mappedWithProfit) * 100) / 100 : 0,
      avgSellTry: mappedWithProfit ? Math.round((sellSum / mappedWithProfit) * 100) / 100 : 0,
      avgProfitTry: mappedWithProfit ? Math.round((profitSum / mappedWithProfit) * 100) / 100 : 0,
      lowMarginCount,
    },
    providerBreakdown,
    orderStats: {
      totalOrders: totalPaid,
      paidOrders: totalPaid,
      fulfilledOrders,
      failedOrders,
      revenueTry: Math.round(revenueTry * 100) / 100,
      estimatedCostTry: Math.round(estimatedCostTry * 100) / 100,
      estimatedProfitTry: Math.round(estimatedProfitTry * 100) / 100,
      avgMarginPercent: ordersWithCost ? Math.round((orderMarginSum / ordersWithCost) * 10) / 10 : 0,
      wholesaleOrderCount,
      resellerOrderCount,
    },
    recentOrders: recentOrders.slice(0, 15),
    fees: {
      minProfitPercent: markup.minProfitPercent,
      usdTry: markup.usdTry,
      preferWholesale: markup.preferWholesale !== false,
      autoCheapest: markup.autoCheapest,
      paytrRateLabel: formatCommissionPercent(paytrRate),
      paytrFixedTry: getPaytrCommissionFixedTry(),
      paytrNote: 'PayTR komisyonu bakiye yüklemesinde müşteriden alınır.',
      marginFormula: 'Kar ₺ = Satış − (miktar/1000 × rate × USD/TRY)',
      example: {
        sellTry: Math.round(exampleSell),
        costTry: Math.round(exampleCost * 100) / 100,
        profitTry: Math.round(exampleProfit * 100) / 100,
        marginPercent: exampleSell > 0 ? Math.round((exampleProfit / exampleSell) * 1000) / 10 : 0,
      },
    },
    demoMode,
  }
}
