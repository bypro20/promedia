import { prisma } from '@/lib/db'
import { getService } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { createSmmOrder, fetchSmmOrderStatus, normalizeSmmStatus, requestSmmRefill } from '@/lib/smm/client'
import { buildTargetLink } from '@/lib/smm/link'
import { resolveSmmService } from '@/lib/smm/mapping'
import { ensureSmmKeyCache } from '@/lib/smm/key-store'
import { isDemoMode, isSmmConfigured } from '@/lib/smm/providers'

import { debitBalance } from '@/lib/wallet'

function generateOrderCode() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `PM-${n}`
}

function findPackage(serviceSlug: string, tierId: PackageTier, packageId: string) {
  const service = getService(serviceSlug)
  if (!service) throw new Error('Hizmet bulunamadı')

  const tier = service.tiers.find((t) => t.id === tierId)
  if (!tier) throw new Error('Paket kademesi bulunamadı')

  const pkg = tier.packages.find((p) => p.id === packageId)
  if (!pkg) throw new Error('Paket bulunamadı')

  return { service, tier, pkg }
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
  const { service, tier, pkg } = findPackage(input.serviceSlug, input.tierId, input.packageId)
  const link = buildTargetLink(service, input.target)

  if (input.payFromBalance && input.userId) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } })
    if (!user) throw new Error('Kullanıcı bulunamadı')
    if (user.balance < pkg.price) throw new Error('Yetersiz bakiye. Panelden bakiye yükleyin.')
  }

  let code = generateOrderCode()
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { code } })
    if (!exists) break
    code = generateOrderCode()
  }

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
      paymentStatus: input.payFromBalance ? 'paid' : 'pending',
      status: 'pending',
    },
  })

  if (input.payFromBalance && input.userId) {
    await debitBalance(input.userId, pkg.price, `Sipariş ${code}`, order.id)
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
    const resolved = await resolveSmmService(input.serviceSlug, input.tierId, pkg.amount)
    const smmRes = await createSmmOrder({
      serviceId: resolved.serviceId,
      link,
      quantity: pkg.amount,
      providerId: resolved.providerId,
    })

    if (smmRes.error || !smmRes.order) {
      return prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'failed',
          smmProvider: resolved.providerId,
          smmServiceId: resolved.serviceId,
          errorMessage: smmRes.error ?? 'SMM siparişi oluşturulamadı',
        },
      })
    }

    return prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'processing',
        smmProvider: resolved.providerId,
        smmServiceId: resolved.serviceId,
        smmOrderId: String(smmRes.order),
        smmStatus: 'Pending',
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
    tierId: order.tierId,
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
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}
