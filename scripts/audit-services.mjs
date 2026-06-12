#!/usr/bin/env node
/**
 * prmdia.com servis denetimi — sayfa erişimi, SMM panel, eşleme durumu
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.SITE_URL || 'https://prmdia.com'

const SMM_PANELS = [
  { id: 'smmservisim', name: 'SmmServisim', url: 'https://smmservisim.com/api/v2', env: 'SMM_KEY_SMMSERVISIM' },
  { id: 'bulkfollows', name: 'BulkFollows', url: 'https://bulkfollows.com/api/v2', env: 'SMM_KEY_BULKFOLLOWS' },
  { id: 'smmkings', name: 'SMMKings', url: 'https://smmkings.com/api/v2', env: 'SMM_KEY_SMMKINGS' },
  { id: 'smmraja', name: 'SMMRaja', url: 'https://smmraja.com/api/v2', env: 'SMM_KEY_SMMRAJA' },
  { id: 'growfollows', name: 'GrowFollows', url: 'https://growfollows.com/api/v2', env: 'SMM_KEY_GROWFOLLOWS' },
  { id: 'prm4u', name: 'PRM4U', url: 'https://prm4u.com/api/v2', env: 'SMM_KEY_PRM4U' },
  { id: 'jap', name: 'JustAnotherPanel', url: 'https://justanotherpanel.com/api/v2', env: 'SMM_KEY_JAP' },
]

function extractSlugs() {
  const src = readFileSync(join(ROOT, 'src/lib/catalog.ts'), 'utf8')
  const slugs = []
  for (const m of src.matchAll(/slug:\s*'([^']+)'/g)) slugs.push(m[1])
  // makeService builds slug as platform-key-satin-al — parse from href patterns
  const hrefs = [...src.matchAll(/href:\s*`\/\$\{p\.slug\}-\$\{s\.key\}-satin-al`/g)]
  if (hrefs.length) {
    // rebuild from platform blocks
    const platforms = [...src.matchAll(/slug:\s*'(\w+)',\s*name:[\s\S]*?services:\s*\[([\s\S]*?)\],/g)]
    const out = []
    for (const p of platforms) {
      const keys = [...p[2].matchAll(/key:\s*'([^']+)'/g)].map((k) => k[1])
      for (const key of keys) out.push(`${p[1]}-${key}-satin-al`)
    }
    return [...new Set(out)]
  }
  return slugs
}

async function checkPage(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
    return { path, status: res.status, ok: res.status >= 200 && res.status < 400 }
  } catch (e) {
    return { path, status: 0, ok: false, error: String(e) }
  }
}

async function testPanel(panel) {
  const key = process.env[panel.env]
  if (!key) return { ...panel, configured: false, ok: false, reason: 'Key tanımlı değil' }
  try {
    const res = await fetch(panel.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key, action: 'balance' }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.error) return { ...panel, configured: true, ok: false, reason: data.error }
    if (!res.ok) return { ...panel, configured: true, ok: false, reason: `HTTP ${res.status}` }
    return { ...panel, configured: true, ok: true, balance: data.balance, currency: data.currency }
  } catch (e) {
    return { ...panel, configured: true, ok: false, reason: String(e) }
  }
}

async function countServices(panel) {
  const key = process.env[panel.env]
  if (!key) return 0
  try {
    const res = await fetch(panel.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key, action: 'services' }),
    })
    const data = await res.json()
    return Array.isArray(data) ? data.length : 0
  } catch {
    return 0
  }
}

function extractSlugsFromCatalog() {
  const src = readFileSync(join(ROOT, 'src/lib/catalog.ts'), 'utf8')
  const platforms = [...src.matchAll(/slug:\s*'(\w+)',\s*name:[\s\S]*?services:\s*\[([\s\S]*?)\n\s*\],/g)]
  const out = []
  for (const p of platforms) {
    const keys = [...p[2].matchAll(/key:\s*'([^']+)'/g)].map((k) => k[1])
    for (const key of keys) out.push(`${p[1]}-${key}-satin-al`)
  }
  return out
}

async function main() {
  console.log(`\n🔍 ProMedia Servis Denetimi — ${BASE}\n`)

  // 1) Sayfa kontrolü
  const slugs = extractSlugsFromCatalog()
  const staticRoutes = ['/', '/hizmetler', '/giris', '/kayit', '/sepet', '/siparis-sorgula', '/blog', '/ucretsiz-araclar']
  const serviceRoutes = slugs.map((s) => `/${s}`)
  const allRoutes = [...staticRoutes, ...serviceRoutes]

  console.log(`── Sayfa erişimi (${allRoutes.length} URL) ──`)
  const pageResults = []
  for (const path of allRoutes) {
    const r = await checkPage(path)
    pageResults.push(r)
    if (!r.ok) console.log(`  ✗ ${path} → ${r.status}${r.error ? ` (${r.error})` : ''}`)
  }
  const pageOk = pageResults.filter((r) => r.ok).length
  const pageFail = pageResults.filter((r) => !r.ok)
  console.log(`  ${pageOk}/${allRoutes.length} sayfa erişilebilir`)
  if (pageFail.length === 0) console.log('  ✓ Tüm servis sayfaları 200/3xx')

  // 2) SMM panel kontrolü
  console.log(`\n── SMM paneller (${SMM_PANELS.length}) ──`)
  const panelResults = await Promise.all(SMM_PANELS.map(testPanel))
  const panelOk = []
  const panelFail = []
  const panelMissing = []
  for (const p of panelResults) {
    if (!p.configured) {
      panelMissing.push(p)
      console.log(`  ○ ${p.name} — key yok`)
    } else if (p.ok) {
      const svcCount = await countServices(p)
      panelOk.push({ ...p, svcCount })
      console.log(`  ✓ ${p.name} — ${p.balance} ${p.currency} · ${svcCount} servis`)
    } else {
      panelFail.push(p)
      console.log(`  ✗ ${p.name} — ${p.reason}`)
    }
  }

  // 3) Özet
  console.log('\n── Özet ──')
  console.log(`Sayfa hatası: ${pageFail.length}`)
  if (pageFail.length) pageFail.slice(0, 15).forEach((p) => console.log(`  • ${p.path}`))
  if (pageFail.length > 15) console.log(`  … +${pageFail.length - 15} daha`)

  console.log(`\nSMM panel: ${panelOk.length} çalışıyor, ${panelFail.length} hatalı, ${panelMissing.length} tanımsız`)

  if (panelOk.length === 0) {
    console.log('\n⚠️  Hiçbir SMM paneli çalışmıyor — sipariş teslimatı yapılamaz (demo mod)')
  } else if (panelMissing.includes((p) => p.id === 'prm4u') || !panelOk.find((p) => p.id === 'prm4u')) {
    console.log('\n💡 Toptan panel (PRM4U) eklenmemiş — maliyet yüksek kalır')
  }

  const zeroBalance = panelOk.filter((p) => parseFloat(p.balance) <= 0)
  if (zeroBalance.length) {
    console.log('\n⚠️  Sıfır bakiyeli paneller (sipariş gönderilemez):')
    zeroBalance.forEach((p) => console.log(`  • ${p.name} (${p.balance} ${p.currency})`))
  }

  console.log('\n📋 Eşleme durumu için: Admin → SMM Paneller → "Tüm Servisleri Otomatik Eşle"')
  console.log('   veya: npx tsx scripts/audit-services.mjs (Turso bağlantılı tam rapor)\n')

  process.exit(pageFail.length > 0 || panelFail.length > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
