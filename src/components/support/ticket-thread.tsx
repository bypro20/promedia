'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  body: string
  isStaff: boolean
  createdAt: string
}

type Props = {
  ticketId: string
  apiBase: '/api/panel/tickets' | '/api/admin/tickets'
  subject?: string
  status?: string
  onStatusChange?: () => void
}

export function TicketThread({ ticketId, apiBase, subject, status, onStatusChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  function load() {
    void fetch(`${apiBase}/${ticketId}`).then((r) => r.json()).then((d) => {
      if (d.ok) setMessages(d.messages)
    })
  }

  useEffect(() => { load() }, [ticketId, apiBase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    const res = await fetch(`${apiBase}/${ticketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    const d = await res.json()
    setLoading(false)
    if (d.ok) {
      setBody('')
      load()
      onStatusChange?.()
    }
  }

  async function closeTicket() {
    if (apiBase !== '/api/admin/tickets') return
    await fetch(`${apiBase}/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' }),
    })
    onStatusChange?.()
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      {(subject || status) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E9EBF5] px-5 py-4">
          <div>
            {subject && <h2 className="font-bold text-[#33353E]">{subject}</h2>}
            {status && (
              <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                status === 'open' ? 'bg-green-100 text-green-700' : 'bg-[#F0F1F9] text-[#666F94]'
              }`}>
                {status === 'open' ? 'Açık' : 'Kapalı'}
              </span>
            )}
          </div>
          {apiBase === '/api/admin/tickets' && status === 'open' && (
            <button type="button" onClick={closeTicket} className="rounded-lg bg-[#F0F1F9] px-3 py-1.5 text-xs font-bold text-[#666F94]">
              Talebi Kapat
            </button>
          )}
        </div>
      )}
      <div className="max-h-[420px] space-y-3 overflow-y-auto p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.isStaff
                ? 'ml-auto bg-[#7844E4] text-white'
                : 'bg-[#F0F1F9] text-[#33353E]'
            }`}
          >
            <p className="whitespace-pre-wrap">{m.body}</p>
            <p className={`mt-1 text-[10px] ${m.isStaff ? 'text-white/60' : 'text-[#666F94]'}`}>
              {m.isStaff ? 'Destek' : 'Siz'} · {new Date(m.createdAt).toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {status !== 'closed' && (
        <form onSubmit={send} className="border-t border-[#E9EBF5] p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Mesajınızı yazın..."
            className="w-full rounded-xl border border-[#E9EBF5] px-3 py-2 text-sm outline-none focus:border-[#7844E4]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? 'Gönderiliyor…' : 'Gönder'}
          </button>
        </form>
      )}
    </div>
  )
}
