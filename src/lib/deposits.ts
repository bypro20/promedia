import { prisma } from '@/lib/db'
import { creditBalance } from '@/lib/wallet'
import { emailDepositApproved } from '@/lib/email'

export type DepositMethod = 'havale' | 'papara' | 'eft'

export async function createDepositRequest(
  userId: string,
  amount: number,
  method: DepositMethod,
  reference?: string
) {
  const pending = await prisma.depositRequest.findFirst({
    where: { userId, status: 'pending' },
  })
  if (pending) {
    throw new Error('Zaten bekleyen bir bakiye talebiniz var. Onaylanmasını bekleyin veya destek ile iletişime geçin.')
  }

  return prisma.depositRequest.create({
    data: { userId, amount, method, reference: reference?.trim() || null },
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
