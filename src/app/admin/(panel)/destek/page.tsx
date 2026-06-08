'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Ticket = {
  id: string
  subject: string
  status: string
  priority: string
  createdAt: string
  user: { email: string; name: string | null }
  messages: { body: string }[]
  _count: { messages: number }
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  function load() {
    void fetch('/api/admin/tickets').then((r) => r.json()).then((d) => { if (d.ok) setTickets(d.tickets) })
  }

  useEffect(() => { load() }, [])

  const open = tickets.filter((t) => t.status === 'open')

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#33353E]">Destek Talepleri</h1>
        <p className="mt-1 text-sm text-[#666F94]">
          Bakiye talepleri{' '}
          <Link href="/admin/bakiye" className="font-bold text-[#7844E4]">Bakiye Yönetimi</Link>
          {' '}sayfasındadır.
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Açık destek</p>
          <p className="text-2xl font-black text-[#7844E4]">{open.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Toplam kayıt</p>
          <p className="text-2xl font-black">{tickets.length}</p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-[#666F94]">Henüz destek talebi yok.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link href={`/admin/destek/${t.id}`} className="block rounded-2xl bg-white p-5 shadow-sm hover:ring-2 hover:ring-[#7844E4]/20">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#33353E]">{t.subject}</p>
                    <p className="mt-1 text-sm text-[#666F94]">
                      {t.user.email}{t.user.name ? ` · ${t.user.name}` : ''}
                    </p>
                    {t.messages[0] && (
                      <p className="mt-2 line-clamp-2 text-sm text-[#666F94]">{t.messages[0].body}</p>
                    )}
                    <p className="mt-2 text-xs text-[#666F94]">
                      {t._count.messages} mesaj · {new Date(t.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-[#F0F1F9] text-[#666F94]'
                  }`}>
                    {t.status === 'open' ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
