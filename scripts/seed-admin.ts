import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const url = process.env.DATABASE_URL || 'file:./prisma/dev.db'
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'bypro1988@gmail.com'
  const password = process.env.ADMIN_PASSWORD ?? 'ProMedia2026!'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { role: 'admin' } })
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
  .finally(() => prisma.$disconnect())
