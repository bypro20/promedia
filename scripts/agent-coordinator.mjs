#!/usr/bin/env node
/**
 * ProMedia Agent Koordinatörü
 * Proje durumunu tarar, rollere görev dağıtır, JSON/insan okunur rapor üretir.
 */
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = process.env.SITE_URL || 'https://promedia-kappa.vercel.app'
const TASKS_FILE = join(ROOT, 'AGENT_TASKS.md')

const ROLES = {
  coord: { name: 'Koordinatör', model: 'composer-2.5-fast' },
  ui: { name: 'Frontend', model: 'gemini-3.5-flash' },
  api: { name: 'Backend', model: 'gpt-5.3-codex-high-fast' },
  ops: { name: 'DevOps', model: 'composer-2.5-fast' },
  qa: { name: 'QA', model: 'gemini-3.5-flash' },
  content: { name: 'İçerik', model: 'claude-4.6-sonnet-medium-thinking' },
}

function parseTasks(md) {
  const pending = []
  const done = []
  for (const line of md.split('\n')) {
    const m = line.match(/^- \[([ x])\] `\[(\w+)\]` (.+)/)
    if (!m) continue
    const item = { role: m[2], task: m[3], done: m[1] === 'x' }
    if (item.done) done.push(item)
    else pending.push(item)
  }
  return { pending, done }
}

async function probe(path) {
  try {
    const res = await fetch(`${SITE}${path}`, { redirect: 'manual' })
    return { path, ok: res.status >= 200 && res.status < 400, status: res.status }
  } catch (e) {
    return { path, ok: false, status: 0, error: String(e) }
  }
}

async function liveChecks() {
  const paths = ['/giris', '/api/auth/config', '/api/smm/status', '/admin']
  const results = await Promise.all(paths.map(probe))
  let google = false
  let smmConfigured = false
  try {
    const cfg = await fetch(`${SITE}/api/auth/config`).then((r) => r.json())
    google = Boolean(cfg.google)
  } catch { /* */ }
  try {
    const smm = await fetch(`${SITE}/api/smm/status`).then((r) => r.json())
    smmConfigured = Boolean(smm.configured)
  } catch { /* */ }
  return { routes: results, google, smmConfigured }
}

function gitDirty() {
  try {
    const out = execSync('git status -sb', { cwd: ROOT, encoding: 'utf8' })
    return out.includes(' M ') || out.includes('??')
  } catch {
    return null
  }
}

function assignAutoTasks(live) {
  const auto = []
  if (!live.google) {
    auto.push({ role: 'ops', task: 'Google Console redirect URI ekle + doğrula', priority: 'blocker' })
  }
  if (!live.smmConfigured) {
    auto.push({ role: 'api', task: 'Admin SMM panelden API key kaydet', priority: 'blocker' })
  }
  const broken = live.routes.filter((r) => !r.ok)
  for (const b of broken) {
    auto.push({ role: 'qa', task: `Kırık route düzelt: ${b.path} (${b.status})`, priority: 'high' })
  }
  if (gitDirty()) {
    auto.push({ role: 'ops', task: 'Git commit + push + redeploy', priority: 'high' })
  }
  return auto
}

async function main() {
  const format = process.argv.includes('--json') ? 'json' : 'text'
  const tasksMd = existsSync(TASKS_FILE) ? readFileSync(TASKS_FILE, 'utf8') : ''
  const { pending, done } = parseTasks(tasksMd)
  const live = await liveChecks()
  const autoTasks = assignAutoTasks(live)

  const byRole = {}
  for (const role of Object.keys(ROLES)) {
    byRole[role] = {
      ...ROLES[role],
      fromFile: pending.filter((t) => t.role === role),
      auto: autoTasks.filter((t) => t.role === role),
    }
  }

  const report = {
    site: SITE,
    timestamp: new Date().toISOString(),
    live: {
      googleOAuth: live.google,
      smmConfigured: live.smmConfigured,
      routes: live.routes,
    },
    stats: { pending: pending.length, done: done.length, auto: autoTasks.length },
    roles: byRole,
    dispatchOrder: ['qa', 'api', 'ui', 'content', 'ops', 'coord'],
  }

  if (format === 'json') {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`\n🤖 ProMedia Agent Ekibi — ${SITE}\n`)
  console.log(`Google OAuth: ${live.google ? '✓ key var' : '✗ redirect URI / key eksik'}`)
  console.log(`SMM: ${live.smmConfigured ? '✓ yapılandırıldı' : '✗ demo mod (key yok)'}`)
  console.log(`Görevler: ${pending.length} bekleyen, ${done.length} tamamlanan\n`)

  for (const roleId of report.dispatchOrder) {
    const r = byRole[roleId]
    const all = [...r.auto, ...r.fromFile]
    if (all.length === 0 && roleId !== 'coord') continue
    console.log(`── ${r.name} (${r.model}) ──`)
    if (all.length === 0) {
      console.log('  (görev yok — diğer agent\'ları bekle)\n')
      continue
    }
    for (const t of all) {
      const tag = t.priority ? `[${t.priority}] ` : ''
      console.log(`  • ${tag}${t.task}`)
    }
    console.log('')
  }

  console.log('Paralel başlat: AGENT_TEAM.md → "5 role paralel Task başlat"\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
