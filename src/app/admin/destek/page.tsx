'use client'

import { useEffect, useState } from 'react'

type Ticket = { id: string; subject: string; status: string; user: { email: string } }

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    void fetch('/api/admin/tickets').then((r) => r.json()).then((d) => { if (d.ok) setTickets(d.tickets) })
  }, [])

  async function close(id: string) {
    await fetch('/api/admin/tickets', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: id, status: 'closed' }) })
    const d = await fetch('/api/admin/tickets').then((r) => r.json())
    if (d.ok) setTickets(d.tickets)
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Destek Talepleri</h1>
      <ul className="mt-6 space-y-3">
        {tickets.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm text-sm">
            <div><strong>{t.subject}</strong><p className="text-[#666F94]">{t.user.email}</p></div>
            <div className="flex items-center gap-2">
              <span className="text-[#7844E4]">{t.status}</span>
              {t.status === 'open' && <button type="button" onClick={() => close(t.id)} className="text-xs font-bold">Kapat</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
