#!/usr/bin/env node
/** ProMedia site health checker — çalışmayan sayfaları tespit eder */
const BASE = process.env.SITE_URL || 'http://localhost:3000'

const ROUTES = [
  '/',
  '/hizmetler',
  '/giris',
  '/kayit',
  '/siparis-sorgula',
  '/telafi-talebi',
  '/panel',
  '/admin',
  '/instagram-takipci-satin-al',
  '/tiktok-takipci-satin-al',
  '/api/smm/status',
]

async function check(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
    const ok = res.status >= 200 && res.status < 400
    return { path, status: res.status, ok }
  } catch (e) {
    return { path, status: 0, ok: false, error: String(e) }
  }
}

async function main() {
  console.log(`ProMedia Health Check — ${BASE}\n`)
  const results = await Promise.all(ROUTES.map(check))
  let failed = 0
  for (const r of results) {
    const icon = r.ok ? '✓' : '✗'
    console.log(`${icon} ${r.path} → ${r.status}`)
    if (!r.ok) failed++
  }
  console.log(`\n${results.length - failed}/${results.length} OK`)
  process.exit(failed > 0 ? 1 : 0)
}

main()
