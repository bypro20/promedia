'use client'

import { useCallback, useEffect, useState } from 'react'

type IpBan = {
  id: string
  ip: string
  reason: string | null
  createdAt: string
  user: { email: string } | null
}

type Log = {
  id: string
  action: string
  target: string | null
  detail: string | null
  ip: string | null
  createdAt: string
}

export default function AdminSecurityPage() {
  const [ipBans, setIpBans] = useState<IpBan[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [ip, setIp] = useState('')
  const [reason, setReason] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(() => {
    void fetch('/api/admin/security').then((r) => r.json()).then((d) => {
      if (d.ok) {
        setIpBans(d.ipBans)
        setLogs(d.logs)
      }
    })
  }, [])

  useEffect(() => { load() }, [load])

  async function banIp(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/admin/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ban_ip', ip, reason }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
    if (d.ok) { setIp(''); setReason(''); load() }
  }

  async function unbanIp(bannedIp: string) {
    const res = await fetch('/api/admin/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unban_ip', ip: bannedIp }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
    if (d.ok) load()
  }

  return (
    <main className="p-4 lg:p-8">
      <h1 className="text-2xl font-black text-[#33353E]">Güvenlik Merkezi</h1>
      <p className="mt-1 text-sm text-[#666F94]">IP ban listesi, güvenlik logları. Banlı IP siteye bir daha giremez.</p>

      {msg && <p className="mt-4 rounded-xl bg-[#EDE5FF] p-3 text-sm text-[#7844E4]">{msg}</p>}

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Manuel IP Ban</h2>
        <form onSubmit={banIp} className="mt-3 flex flex-wrap gap-2">
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="rounded-xl border px-3 py-2 text-sm font-mono"
            required
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sebep"
            className="min-w-[160px] flex-1 rounded-xl border px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">
            IP Ban At
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Aktif IP Banları ({ipBans.length})</h2>
        {ipBans.length === 0 ? (
          <p className="mt-3 text-sm text-[#666F94]">Banlı IP yok.</p>
        ) : (
          <ul className="mt-3 divide-y text-sm">
            {ipBans.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <span className="font-mono font-bold">{b.ip}</span>
                  {b.user && <span className="ml-2 text-[#666F94]">· {b.user.email}</span>}
                  {b.reason && <p className="text-xs text-[#666F94]">{b.reason}</p>}
                </div>
                <button type="button" onClick={() => unbanIp(b.ip)} className="text-xs font-bold text-green-600 hover:underline">
                  Ban Kaldır
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Güvenlik Logları</h2>
        <ul className="mt-3 max-h-96 space-y-1 overflow-y-auto text-xs">
          {logs.map((l) => (
            <li key={l.id} className="flex flex-wrap gap-2 border-b border-[#E9EBF5] py-2 text-[#666F94]">
              <span className="font-bold text-[#33353E]">{l.action}</span>
              <span>{l.target}</span>
              <span>{l.detail}</span>
              <span>{new Date(l.createdAt).toLocaleString('tr-TR')}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
