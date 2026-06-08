import { prisma } from '@/lib/db'

export async function creditBalance(userId: string, amount: number, note: string, type = 'deposit') {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const next = user.balance + amount
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { balance: next } }),
    prisma.transaction.create({
      data: { userId, type, amount, balance: next, note },
    }),
  ])
  return next
}

export async function debitBalance(userId: string, amount: number, note: string, orderId?: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  if (user.balance < amount) throw new Error('Yetersiz bakiye')
  const next = user.balance - amount
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { balance: next } }),
    prisma.transaction.create({
      data: { userId, type: 'order', amount: -amount, balance: next, note, orderId },
    }),
  ])
  return next
}

export async function getTransactions(userId: string, limit = 50) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}
