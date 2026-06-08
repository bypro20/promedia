'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TicketThread } from '@/components/support/ticket-thread'

export default function PanelTicketDetailPage() {
  const params = useParams()
  const id = String(params.id ?? '')
  const [info, setInfo] = useState<{ subject: string; status: string } | null>(null)

  function load() {
    void fetch(`/api/panel/tickets/${id}`).then((r) => r.json()).then((d) => {
      if (d.ok) setInfo({ subject: d.ticket.subject, status: d.ticket.status })
    })
  }

  useEffect(() => { load() }, [id])

  return (
    <main className="p-6 lg:p-8">
      <Link href="/panel/destek" className="text-sm font-semibold text-[#7844E4] hover:underline">← Destek</Link>
      <div className="mt-4">
        <TicketThread
          ticketId={id}
          apiBase="/api/panel/tickets"
          subject={info?.subject}
          status={info?.status}
          onStatusChange={load}
        />
      </div>
    </main>
  )
}
