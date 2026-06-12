import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function normalizeLibsqlUrl(url: string) {
  if (url.startsWith('libsql://')) return url
  if (url.startsWith('https://') && url.includes('.turso.io')) {
    return `libsql://${url.slice('https://'.length)}`
  }
  return url
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  const url = normalizeLibsqlUrl(raw)

  if (url.startsWith('libsql://')) {
    const authToken = process.env.TURSO_AUTH_TOKEN || ''
    if (!authToken && process.env.VERCEL) {
      console.error('[db] TURSO_AUTH_TOKEN missing on Vercel')
    }
    return new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) })
  }

  if (process.env.VERCEL) {
    throw new Error('Vercel requires DATABASE_URL=libsql://your-db.turso.io and TURSO_AUTH_TOKEN')
  }

  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: raw }) })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
globalForPrisma.prisma = prisma
