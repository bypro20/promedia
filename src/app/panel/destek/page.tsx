'use client'

import { useEffect, useState } from 'react'

type Ticket = { id: string; subject: string; status: string; createdAt: string }

export default function PanelSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  function load() {
    void fetch('/api/panel/tickets').then((r) => r.json()).then((d) => { if (d.ok) setTickets(d.tickets) })
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/panel/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, body }) })
    setSubject(''); setBody(''); load()
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Destek</h1>
      <form onSubmit={create} className="mt-6 max-w-lg space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Konu" required className="w-full rounded-xl border px-3 py-2 text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Mesajınız" required rows={4} className="w-full rounded-xl border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Gönder</button>
      </form>
      <ul className="mt-6 space-y-2">
        {tickets.map((t) => (
          <li key={t.id} className="rounded-xl bg-white p-4 shadow-sm text-sm">
            <strong>{t.subject}</strong> — <span className="text-[#7844E4]">{t.status}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
