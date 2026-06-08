import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatPrice } from '@/lib/format'
import { getService } from '@/lib/catalog'

export default async function PanelHome() {
  const user = await getSession()
  if (!user) redirect('/giris')

  const [orders, txCount] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.transaction.count({ where: { userId: user.id } }),
  ])

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-[#33353E]">Hoş geldin, {user.name ?? user.email.split('@')[0]}</h1>
      <p className="mt-1 text-sm text-[#666F94]">Müşteri paneliniz</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Bakiye</p>
          <p className="mt-1 text-2xl font-black text-[#7844E4]">{formatPrice(user.balance)} ₺</p>
          <Link href="/panel/bakiye" className="mt-2 inline-block text-xs font-bold text-[#7844E4]">Bakiye yükle →</Link>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Siparişler</p>
          <p className="mt-1 text-2xl font-black">{await prisma.order.count({ where: { userId: user.id } })}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">İşlemler</p>
          <p className="mt-1 text-2xl font-black">{txCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link href="/hizmetler" className="rounded-xl bg-[#7844E4] px-4 py-2 text-xs font-bold text-white">+ Yeni Sipariş</Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-[#666F94]">Henüz sipariş yok.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E9EBF5] px-4 py-3 text-sm">
                <span className="font-mono font-bold">{o.code}</span>
                <span>{getService(o.serviceSlug)?.title ?? o.serviceSlug}</span>
                <span className="rounded-full bg-[#EDE5FF] px-2 py-0.5 text-xs font-bold text-[#7844E4]">{STATUS_LABELS[o.status] ?? o.status}</span>
                <span>{formatPrice(o.price)} ₺</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
