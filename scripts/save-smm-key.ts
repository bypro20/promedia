import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function createPrisma() {
  const url = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  if (url.startsWith('libsql://')) {
    return new PrismaClient({
      adapter: new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN || '' }),
    })
  }
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })
}

async function main() {
  const envKey = process.argv[2]
  const apiKey = process.argv[3]
  if (!envKey) {
    console.error('Kullanım: npx tsx scripts/save-smm-key.ts SMM_KEY_SMMSERVISIM <api-key>')
    console.error('Silmek için: npx tsx scripts/save-smm-key.ts SMM_KEY_SMMSERVISIM --delete')
    process.exit(1)
  }

  const dbKey = `smm_key_${envKey.toLowerCase()}`
  const prisma = createPrisma()

  if (apiKey === '--delete' || apiKey === '') {
    await prisma.siteSetting.deleteMany({ where: { key: dbKey } })
    console.log('Silindi:', envKey)
    await prisma.$disconnect()
    return
  }

  if (!apiKey) {
    console.error('API key gerekli veya --delete kullanın')
    process.exit(1)
  }
  await prisma.siteSetting.upsert({
    where: { key: dbKey },
    create: { key: dbKey, value: apiKey.trim() },
    update: { value: apiKey.trim() },
  })
  console.log('Kaydedildi:', envKey)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
