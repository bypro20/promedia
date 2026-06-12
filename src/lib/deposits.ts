import { prisma } from '@/lib/db'
import { creditBalance } from '@/lib/wallet'
import { emailDepositApproved } from '@/lib/email'

export type DepositMethod = 'havale' | 'eft' | 'paytr' | 'iyzico'

export async function createDepositRequest(
  userId: string,
  amount: number,
  method: DepositMethod,
  reference?: string
) {
  const pending = await prisma.depositRequest.findFirst({
    where: { userId, status: 'pending', method: { notIn: ['paytr', 'iyzico'] } },
  })
  if (pending) {
    throw new Error('Zaten bekleyen bir bakiye talebiniz var. Onaylanmasını bekleyin veya destek ile iletişime geçin.')
  }

  return prisma.depositRequest.create({
    data: { userId, amount, method, reference: reference?.trim() || null },
  })
}

export async function createIyzicoDepositRequest(input: {
  userId: string
  netAmount: number
  grossAmount: number
  commissionAmount: number
  paymentRef: string
}) {
  const stale = await prisma.depositRequest.findMany({
    where: {
      userId: input.userId,
      method: 'iyzico',
      status: 'pending',
      createdAt: { lt: new Date(Date.now() - 60 * 60 * 1000) },
    },
  })
  for (const s of stale) {
    await prisma.depositRequest.update({
      where: { id: s.id },
      data: { status: 'rejected', adminNote: 'iyzico oturumu zaman aşımı' },
    })
  }

  const pending = await prisma.depositRequest.findFirst({
    where: { userId: input.userId, method: 'iyzico', status: 'pending' },
  })
  if (pending) {
    throw new Error('Devam eden bir kart ödemeniz var. Lütfen tamamlayın veya 1 saat bekleyin.')
  }

  return prisma.depositRequest.create({
    data: {
      userId: input.userId,
      amount: input.netAmount,
      method: 'iyzico',
      grossAmount: input.grossAmount,
      commissionAmount: input.commissionAmount,
      paytrMerchantOid: input.paymentRef,
      status: 'pending',
    },
  })
}

export async function completeIyzicoDeposit(paymentRef: string, paidCents: number) {
  const deposit = await prisma.depositRequest.findUnique({
    where: { paytrMerchantOid: paymentRef },
    include: { user: { select: { email: true } } },
  })
  if (!deposit || deposit.method !== 'iyzico') throw new Error('iyzico talebi bulunamadı')
  if (deposit.status === 'approved') return deposit

  const expectedCents = Math.round((deposit.grossAmount ?? deposit.amount) * 100)
  if (paidCents !== expectedCents) {
    throw new Error(`Tutar uyuşmazlığı: beklenen ${expectedCents}, gelen ${paidCents}`)
  }

  const newBalance = await creditBalance(
    deposit.userId,
    deposit.amount,
    `iyzico bakiye yükleme (₺${(deposit.commissionAmount ?? 0).toFixed(2)} komisyon)`,
    'deposit'
  )

  await prisma.depositRequest.update({
    where: { id: deposit.id },
    data: {
      status: 'approved',
      reviewedAt: new Date(),
      adminNote: 'iyzico otomatik onay',
    },
  })

  if (deposit.user.email) {
    void emailDepositApproved(deposit.user.email, deposit.amount, newBalance)
  }

  return deposit
}

export async function failIyzicoDeposit(paymentRef: string, reason?: string) {
  const deposit = await prisma.depositRequest.findUnique({ where: { paytrMerchantOid: paymentRef } })
  if (!deposit || deposit.method !== 'iyzico' || deposit.status !== 'pending') return null
  return prisma.depositRequest.update({
    where: { id: deposit.id },
    data: {
      status: 'rejected',
      reviewedAt: new Date(),
      adminNote: reason ? `iyzico: ${reason}` : 'iyzico ödeme başarısız',
    },
  })
}

export async function createPaytrDepositRequest(input: {
  userId: string
  netAmount: number
  grossAmount: number
  commissionAmount: number
  merchantOid: string
}) {
  const stalePaytr = await prisma.depositRequest.findMany({
    where: {
      userId: input.userId,
      method: 'paytr',
      status: 'pending',
      createdAt: { lt: new Date(Date.now() - 60 * 60 * 1000) },
    },
  })
  for (const s of stalePaytr) {
    await prisma.depositRequest.update({
      where: { id: s.id },
      data: { status: 'rejected', adminNote: 'PayTR oturumu zaman aşımı' },
    })
  }

  const pendingPaytr = await prisma.depositRequest.findFirst({
    where: { userId: input.userId, method: 'paytr', status: 'pending' },
  })
  if (pendingPaytr) {
    throw new Error('Devam eden bir kart ödemeniz var. Lütfen tamamlayın veya 1 saat bekleyin.')
  }

  return prisma.depositRequest.create({
    data: {
      userId: input.userId,
      amount: input.netAmount,
      method: 'paytr',
      grossAmount: input.grossAmount,
      commissionAmount: input.commissionAmount,
      paytrMerchantOid: input.merchantOid,
      status: 'pending',
    },
  })
}

export async function completePaytrDeposit(merchantOid: string, paidCents: number) {
  const deposit = await prisma.depositRequest.findUnique({
    where: { paytrMerchantOid: merchantOid },
    include: { user: { select: { email: true } } },
  })
  if (!deposit) throw new Error('PayTR talebi bulunamadı')
  if (deposit.status === 'approved') return deposit

  const expectedCents = Math.round((deposit.grossAmount ?? deposit.amount) * 100)
  if (paidCents !== expectedCents) {
    throw new Error(`Tutar uyuşmazlığı: beklenen ${expectedCents}, gelen ${paidCents}`)
  }

  const newBalance = await creditBalance(
    deposit.userId,
    deposit.amount,
    `PayTR bakiye yükleme (₺${(deposit.commissionAmount ?? 0).toFixed(2)} komisyon müşteriye yansıtıldı)`,
    'deposit'
  )

  await prisma.depositRequest.update({
    where: { id: deposit.id },
    data: {
      status: 'approved',
      reviewedAt: new Date(),
      adminNote: 'PayTR otomatik onay',
    },
  })

  if (deposit.user.email) {
    void emailDepositApproved(deposit.user.email, deposit.amount, newBalance)
  }

  return deposit
}

export async function failPaytrDeposit(merchantOid: string, reason?: string) {
  const deposit = await prisma.depositRequest.findUnique({ where: { paytrMerchantOid: merchantOid } })
  if (!deposit || deposit.status !== 'pending') return null
  return prisma.depositRequest.update({
    where: { id: deposit.id },
    data: {
      status: 'rejected',
      reviewedAt: new Date(),
      adminNote: reason ? `PayTR: ${reason}` : 'PayTR ödeme başarısız',
    },
  })
}

export async function listUserDeposits(userId: string, limit = 20) {
  return prisma.depositRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function listPendingDeposits() {
  return prisma.depositRequest.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, email: true, name: true, balance: true } } },
  })
}

export async function listAllDeposits(limit = 50) {
  return prisma.depositRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { id: true, email: true, name: true, balance: true } } },
  })
}

export async function approveDeposit(depositId: string, adminNote?: string) {
  const deposit = await prisma.depositRequest.findUnique({ where: { id: depositId } })
  if (!deposit) throw new Error('Talep bulunamadı')
  if (deposit.status !== 'pending') throw new Error('Talep zaten işlenmiş')

  const newBalance = await creditBalance(
    deposit.userId,
    deposit.amount,
    `Bakiye yükleme onaylandı (${deposit.method})`,
    'deposit'
  )

  await prisma.depositRequest.update({
    where: { id: depositId },
    data: {
      status: 'approved',
      adminNote: adminNote?.trim() || null,
      reviewedAt: new Date(),
    },
  })

  const user = await prisma.user.findUnique({ where: { id: deposit.userId }, select: { email: true } })
  if (user) {
    void emailDepositApproved(user.email, deposit.amount, newBalance)
  }

  return newBalance
}

export async function rejectDeposit(depositId: string, adminNote?: string) {
  const deposit = await prisma.depositRequest.findUnique({ where: { id: depositId } })
  if (!deposit) throw new Error('Talep bulunamadı')
  if (deposit.status !== 'pending') throw new Error('Talep zaten işlenmiş')

  return prisma.depositRequest.update({
    where: { id: depositId },
    data: {
      status: 'rejected',
      adminNote: adminNote?.trim() || null,
      reviewedAt: new Date(),
    },
  })
}

export async function countPendingDeposits() {
  return prisma.depositRequest.count({ where: { status: 'pending' } })
}
