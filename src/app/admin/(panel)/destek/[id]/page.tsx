'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TicketThread } from '@/components/support/ticket-thread'

type TicketInfo = {
  subject: string
  status: string
  user: { email: string; name: string | null }
}

export default function AdminTicketDetailPage() {
  const params = useParams()
  const id = String(params.id ?? '')
  const [info, setInfo] = useState<TicketInfo | null>(null)

  function load() {
    void fetch(`/api/admin/tickets/${id}`).then((r) => r.json()).then((d) => {
      if (d.ok) setInfo({ subject: d.ticket.subject, status: d.ticket.status, user: d.ticket.user })
    })
  }

  useEffect(() => { load() }, [id])

  return (
    <main className="p-6 lg:p-8">
      <Link href="/admin/destek" className="text-sm font-semibold text-[#7844E4] hover:underline">← Destek</Link>
      {info && (
        <p className="mt-4 text-sm text-[#666F94]">
          {info.user.email}{info.user.name ? ` · ${info.user.name}` : ''}
        </p>
      )}
      <div className="mt-4">
        <TicketThread
          ticketId={id}
          apiBase="/api/admin/tickets"
          subject={info?.subject}
          status={info?.status}
          onStatusChange={load}
        />
      </div>
    </main>
  )
}
