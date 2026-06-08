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

/** Admin: bakiyeyi girilen tutara ayarlar (üzerine eklemez) */
export async function setBalance(userId: string, newBalance: number, note: string) {
  if (newBalance < 0) throw new Error('Bakiye negatif olamaz')
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const delta = newBalance - user.balance
  if (delta === 0) return newBalance
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { balance: newBalance } }),
    prisma.transaction.create({
      data: {
        userId,
        type: 'adjustment',
        amount: delta,
        balance: newBalance,
        note: note || `Bakiye ${newBalance.toFixed(2)} ₺ olarak ayarlandı`,
      },
    }),
  ])
  return newBalance
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

/** Sipariş iadesi — bakiyeye geri yükler (bir kez) */
export async function refundOrderBalance(userId: string, amount: number, orderCode: string, orderId: string) {
  const existing = await prisma.transaction.findFirst({
    where: { userId, orderId, type: 'refund' },
  })
  if (existing) throw new Error('Bu sipariş için iade zaten yapıldı')

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const next = user.balance + amount
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { balance: next } }),
    prisma.transaction.create({
      data: { userId, type: 'refund', amount, balance: next, note: `İade: ${orderCode}`, orderId },
    }),
  ])
  return next
}
