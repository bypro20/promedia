'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Ticket = { id: string; subject: string; status: string; createdAt: string }

export default function PanelSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  function load() {
    void fetch('/api/panel/tickets').then((r) => r.json()).then((d) => { if (d.ok) setTickets(d.tickets) })
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/panel/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    })
    const d = await res.json()
    if (d.ok) {
      setSubject('')
      setBody('')
      load()
      window.location.href = `/panel/destek/${d.ticket.id}`
    } else {
      setMsg(d.error)
    }
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Destek</h1>
      <p className="mt-1 text-sm text-[#666F94]">Bakiye yükleme için <Link href="/panel/bakiye" className="font-bold text-[#7844E4]">Bakiye Yükle</Link> sayfasını kullanın.</p>

      <form onSubmit={create} className="mt-6 max-w-lg space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Konu" required className="w-full rounded-xl border px-3 py-2 text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Mesajınız" required rows={4} className="w-full rounded-xl border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Talep Oluştur</button>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </form>

      <ul className="mt-6 space-y-2">
        {tickets.map((t) => (
          <li key={t.id}>
            <Link href={`/panel/destek/${t.id}`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:ring-2 hover:ring-[#7844E4]/20">
              <div>
                <strong>{t.subject}</strong>
                <p className="text-xs text-[#666F94]">{new Date(t.createdAt).toLocaleString('tr-TR')}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-[#F0F1F9] text-[#666F94]'}`}>
                {t.status === 'open' ? 'Açık' : 'Kapalı'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
