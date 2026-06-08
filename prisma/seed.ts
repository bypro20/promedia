import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'bypro1988@gmail.com'
  const password = process.env.ADMIN_PASSWORD ?? 'ProMedia2026!'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (existing.role !== 'admin') {
      await prisma.user.update({ where: { id: existing.id }, data: { role: 'admin' } })
    }
    console.log('Admin hazır:', email)
    return
  }

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      name: 'Admin',
      role: 'admin',
      balance: 1000,
    },
  })

  console.log('Admin oluşturuldu:', email, '/', password)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
