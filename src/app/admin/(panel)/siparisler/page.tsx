'use client'

import { useEffect, useState } from 'react'

type Order = { id: string; code: string; status: string; price: number; serviceSlug: string; user?: { email: string } | null; email: string | null }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    void fetch('/api/admin/orders').then((r) => r.json()).then((d) => { if (d.ok) setOrders(d.orders) })
  }, [])

  async function refresh(code: string) {
    await fetch('/api/admin/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, action: 'refresh' }) })
    const d = await fetch('/api/admin/orders').then((r) => r.json())
    if (d.ok) setOrders(d.orders)
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Siparişler</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm text-sm">
        <table className="w-full">
          <thead><tr className="border-b text-left text-xs text-[#666F94]"><th className="p-3">Kod</th><th className="p-3">Kullanıcı</th><th className="p-3">Hizmet</th><th className="p-3">Durum</th><th className="p-3">Tutar</th><th className="p-3"></th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-3 font-mono text-xs">{o.code}</td>
                <td className="p-3">{o.user?.email ?? o.email ?? 'Misafir'}</td>
                <td className="p-3 max-w-[200px] truncate">{o.serviceSlug}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.price.toFixed(2)} ₺</td>
                <td className="p-3"><button type="button" onClick={() => refresh(o.code)} className="text-xs font-bold text-[#7844E4]">Yenile</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
