import { prisma } from '@/lib/db'
import { getService } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { createSmmOrder, fetchSmmOrderStatus, normalizeSmmStatus, requestSmmRefill } from '@/lib/smm/client'
import { buildTargetLink } from '@/lib/smm/link'
import { resolveSmmServiceCandidates } from '@/lib/smm/mapping'
import { fetchPanelBalance, panelCanAffordOrder, smmCostNative } from '@/lib/smm/panel-balance'
import { loadMarkupConfig } from '@/lib/smm/service-map-store'
import { ensureSmmKeyCache } from '@/lib/smm/key-store'
import { isDemoMode, isSmmConfigured } from '@/lib/smm/providers'

import { debitBalance, refundOrderBalance } from '@/lib/wallet'
import { resolveSellPrice } from '@/lib/smm/pricing-engine'

const PANEL_BALANCE_ERROR =
  'Toptan panel bakiyesi yetersiz. Panele USD yüklenince otomatik gönderilir.'

function generateOrderCode() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `PM-${n}`
}

async function findPackage(serviceSlug: string, tierId: PackageTier, packageId: string) {
  const service = getService(serviceSlug)
  if (!service) throw new Error('Hizmet bulunamadı')

  const tier = service.tiers.find((t) => t.id === tierId)
  if (!tier) throw new Error('Paket kademesi bulunamadı')

  const catalogPkg = tier.packages.find((p) => p.id === packageId)
  if (!catalogPkg) throw new Error('Paket bulunamadı')

  const priced = await resolveSellPrice(serviceSlug, tierId, catalogPkg.amount, catalogPkg.price)
  const pkg = { ...catalogPkg, price: priced.price }

  return { service, tier, pkg, smmCost: priced.cost, margin: priced.margin }
}

/** Ödeme alındıktan sonra SMM paneline otomatik sipariş gönder */
export async function fulfillOrderToSmm(orderId: string) {
  await ensureSmmKeyCache()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Sipariş bulunamadı')
  if (order.smmOrderId && !order.smmOrderId.startsWith('DEMO-')) return order
  if (order.paymentStatus !== 'paid') {
    throw new Error('Ödeme onaylanmadan SMM gönderilemez')
  }

  if (isDemoMode()) {
    const demoId = `DEMO-${Date.now()}`
    return prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'in_progress',
        smmOrderId: demoId,
        smmStatus: 'In progress',
        smmServiceId: 0,
        errorMessage: isSmmConfigured() ? null : 'Demo modu — SMM API anahtarı tanımlı değil',
      },
    })
  }

  try {
    const candidates = await resolveSmmServiceCandidates(
      order.serviceSlug,
      order.tierId as PackageTier,
      order.amount
    )
    let lastError = 'SMM siparişi oluşturulamadı'

    for (const resolved of candidates) {
      const panelBal = await fetchPanelBalance(resolved.providerId)
      if (!panelCanAffordOrder(panelBal, resolved.rate, order.amount)) continue

      const markup = await loadMarkupConfig()
      const costUsd =
        panelBal.currency === 'TRY'
          ? smmCostNative(resolved.rate, order.amount) / markup.usdTry
          : smmCostNative(resolved.rate, order.amount)

      const smmRes = await createSmmOrder({
        serviceId: resolved.serviceId,
        link: order.target,
        quantity: order.amount,
        providerId: resolved.providerId,
      })

      if (smmRes.error || !smmRes.order) {
        lastError = smmRes.error ?? lastError
        continue
      }

      return prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'processing',
          smmProvider: resolved.providerId,
          smmServiceId: resolved.serviceId,
          smmOrderId: String(smmRes.order),
          smmStatus: 'Pending',
          smmCharge: costUsd > 0 ? costUsd : null,
          errorMessage: null,
        },
      })
    }

    const awaitingBalance =
      lastError === 'SMM siparişi oluşturulamadı' ||
      /bakiye yetersiz|insufficient|not enough|balance/i.test(lastError)

    return prisma.order.update({
      where: { id: order.id },
      data: {
        status: awaitingBalance ? 'awaiting_panel_balance' : 'failed',
        errorMessage: awaitingBalance ? PANEL_BALANCE_ERROR : lastError,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'SMM hatası'
    return prisma.order.update({
      where: { id: order.id },
      data: { status: 'failed', errorMessage: message },
    })
  }
}

async function reserveOrderCode() {
  let code = generateOrderCode()
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { code } })
    if (!exists) return code
    code = generateOrderCode()
  }
  return code
}

/** Misafir — iyzico ödeme bekleyen sipariş */
export async function createPendingGuestOrder(input: {
  serviceSlug: string
  tierId: PackageTier
  packageId: string
  target: string
  email: string
}) {
  await ensureSmmKeyCache()
  const { service, pkg } = await findPackage(input.serviceSlug, input.tierId, input.packageId)
  const link = buildTargetLink(service, input.target)
  const code = await reserveOrderCode()

  return prisma.order.create({
    data: {
      code,
      serviceSlug: input.serviceSlug,
      tierId: input.tierId,
      packageId: input.packageId,
      amount: pkg.amount,
      price: pkg.price,
      target: link,
      email: input.email.trim().toLowerCase(),
      paymentStatus: 'pending',
      status: 'pending',
    },
  })
}

export async function completeGuestOrderPayment(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) throw new Error('Sipariş bulunamadı')
  if (order.paymentStatus === 'paid') return fulfillOrderToSmm(order.id)

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'paid' },
  })
  return fulfillOrderToSmm(order.id)
}

export async function failGuestOrderPayment(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order || order.paymentStatus === 'paid') return
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'failed', status: 'cancelled' },
  })
}

export async function createOrder(input: {
  serviceSlug: string
  tierId: PackageTier
  packageId: string
  target: string
  email?: string
  userId?: string
  payFromBalance?: boolean
}) {
  await ensureSmmKeyCache()

  if (!input.userId || !input.payFromBalance) {
    throw new Error('Sipariş için giriş yapın, bakiye yükleyin ve bakiyeden ödeyin.')
  }

  const { service, tier, pkg } = await findPackage(input.serviceSlug, input.tierId, input.packageId)
  const link = buildTargetLink(service, input.target)

  if (input.payFromBalance && input.userId) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } })
    if (!user) throw new Error('Kullanıcı bulunamadı')
    if (user.balance < pkg.price) throw new Error('Yetersiz bakiye. Panelden bakiye yükleyin.')
  }

  const code = await reserveOrderCode()

  const order = await prisma.order.create({
    data: {
      code,
      userId: input.userId ?? null,
      serviceSlug: input.serviceSlug,
      tierId: input.tierId,
      packageId: input.packageId,
      amount: pkg.amount,
      price: pkg.price,
      target: link,
      email: input.email?.trim() || null,
      paymentStatus: 'pending',
      status: 'pending',
    },
  })

  await debitBalance(input.userId!, pkg.price, `Sipariş ${code}`, order.id)
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'paid' },
  })
  return fulfillOrderToSmm(order.id)
}

export async function lookupOrder(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) return null

  if (order.smmOrderId && !order.smmOrderId.startsWith('DEMO-') && !isDemoMode()) {
    try {
      const status = await fetchSmmOrderStatus(order.smmOrderId, order.smmProvider)
      if (!status.error) {
        const normalized = normalizeSmmStatus(status.status)
        return prisma.order.update({
          where: { id: order.id },
          data: {
            status: normalized,
            smmStatus: status.status ?? order.smmStatus,
            smmCharge: status.charge ? Number(status.charge) : order.smmCharge,
            smmStartCount: status.start_count ? Number(status.start_count) : order.smmStartCount,
            smmRemains: status.remains ? Number(status.remains) : order.smmRemains,
          },
        })
      }
    } catch {
      /* keep cached status */
    }
  }

  return order
}

export async function refillOrder(code: string, email: string, userId?: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) throw new Error('Sipariş bulunamadı')

  if (userId && order.userId === userId) {
    /* logged-in owner — skip email check */
  } else if (order.email && order.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new Error('E-posta adresi siparişle eşleşmiyor')
  } else if (!order.email && !email) {
    throw new Error('E-posta gerekli')
  }

  if (!order.smmOrderId) {
    throw new Error('SMM sipariş ID bulunamadı')
  }

  if (order.smmOrderId.startsWith('DEMO-') || isDemoMode()) {
    return prisma.order.update({
      where: { id: order.id },
      data: {
        refillId: `DEMO-REFILL-${Date.now()}`,
        refillStatus: 'Pending',
      },
    })
  }

  const res = await requestSmmRefill(order.smmOrderId, order.smmProvider)
  if (res.error || !res.refill) {
    throw new Error(res.error ?? 'Telafi talebi oluşturulamadı')
  }

  return prisma.order.update({
    where: { id: order.id },
    data: {
      refillId: String(res.refill),
      refillStatus: 'Pending',
    },
  })
}

export function formatOrderForClient(order: Awaited<ReturnType<typeof lookupOrder>>) {
  if (!order) return null

  const service = getService(order.serviceSlug)
  return {
    code: order.code,
    status: order.status,
    smmStatus: order.smmStatus,
    serviceTitle: service?.title ?? order.serviceSlug,
    serviceSlug: order.serviceSlug,
    tierId: order.tierId,
    packageId: order.packageId,
    amount: order.amount,
    unit: service?.unit ?? '',
    price: order.price,
    target: order.target,
    smmOrderId: order.smmOrderId,
    smmRemains: order.smmRemains,
    smmStartCount: order.smmStartCount,
    refillId: order.refillId,
    refillStatus: order.refillStatus,
    errorMessage: order.errorMessage,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}

export async function getOrderForUser(code: string, userId: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order || order.userId !== userId) return null
  return lookupOrder(order.code)
}

export async function adminCancelOrder(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) throw new Error('Sipariş bulunamadı')
  if (['completed', 'cancelled', 'refunded'].includes(order.status)) {
    throw new Error('Bu sipariş iptal edilemez')
  }
  return prisma.order.update({
    where: { id: order.id },
    data: { status: 'cancelled', smmStatus: 'Cancelled' },
  })
}

export async function adminRefundOrder(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) throw new Error('Sipariş bulunamadı')
  if (!order.userId) throw new Error('Misafir sipariş — bakiye iadesi yapılamaz')
  if (order.status === 'refunded') throw new Error('Zaten iade edildi')

  await refundOrderBalance(order.userId, order.price, order.code, order.id)
  return prisma.order.update({
    where: { id: order.id },
    data: { status: 'refunded', paymentStatus: 'refunded' },
  })
}

export async function adminResubmitOrder(code: string) {
  const order = await prisma.order.findUnique({ where: { code: code.trim().toUpperCase() } })
  if (!order) throw new Error('Sipariş bulunamadı')
  if (!['failed', 'cancelled', 'awaiting_panel_balance'].includes(order.status)) {
    throw new Error('Yalnızca başarısız, bekleyen veya iptal siparişler yeniden gönderilebilir')
  }

  await ensureSmmKeyCache()

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'paid', status: 'pending', errorMessage: null },
  })
  return fulfillOrderToSmm(order.id)
}

/** Toptan panele bakiye yüklenince ödenmiş bekleyen siparişleri otomatik gönder */
export async function fulfillOrdersAwaitingPanelBalance(limit = 30) {
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: 'paid',
      OR: [
        { status: 'awaiting_panel_balance' },
        {
          status: { in: ['pending', 'failed'] },
          smmOrderId: null,
          errorMessage: { contains: 'bakiye' },
        },
      ],
    },
    take: limit,
    orderBy: { createdAt: 'asc' },
  })

  let fulfilled = 0
  let stillWaiting = 0
  for (const o of orders) {
    if (o.smmOrderId && !o.smmOrderId.startsWith('DEMO-')) continue
    try {
      const result = await fulfillOrderToSmm(o.id)
      if (result.smmOrderId && !result.smmOrderId.startsWith('DEMO-')) fulfilled++
      else if (result.status === 'awaiting_panel_balance') stillWaiting++
    } catch {
      stillWaiting++
    }
  }
  return { checked: orders.length, fulfilled, stillWaiting }
}

export async function syncPendingOrders(limit = 50) {
  const awaiting = await fulfillOrdersAwaitingPanelBalance(limit)

  const orders = await prisma.order.findMany({
    where: {
      smmOrderId: { not: null },
      status: { in: ['pending', 'processing', 'in_progress'] },
    },
    take: limit,
    orderBy: { updatedAt: 'asc' },
  })

  let updated = 0
  for (const o of orders) {
    if (!o.smmOrderId || o.smmOrderId.startsWith('DEMO-') || isDemoMode()) continue
    try {
      await lookupOrder(o.code)
      updated++
    } catch {
      /* skip */
    }
  }
  return {
    statusSync: { checked: orders.length, updated },
    panelBalanceQueue: awaiting,
  }
}
