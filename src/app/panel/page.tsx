import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatPrice } from '@/lib/format'
import { getService } from '@/lib/catalog'

export default async function PanelHome() {
  const user = await getSession()
  if (!user) redirect('/giris?next=/panel')

  const [orders, orderCount, pendingDeposit] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.depositRequest.findFirst({ where: { userId: user.id, status: 'pending' } }),
  ])

  const displayName = user.name ?? user.email.split('@')[0]

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#33353E]">Merhaba, {displayName}</h1>
        <p className="mt-1 text-sm text-[#666F94]">Sipariş vermek için bakiyenizi kontrol edin ve hizmet seçin.</p>
      </div>

      {pendingDeposit && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{pendingDeposit.amount.toFixed(2)} ₺</strong> bakiye yükleme talebiniz admin onayı bekliyor.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#7844E4] to-[#5a2eb8] p-5 text-white shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Bakiyeniz</p>
          <p className="mt-1 text-3xl font-black">{formatPrice(user.balance)} ₺</p>
          <Link href="/panel/bakiye" className="mt-3 inline-block text-xs font-bold text-white/90 underline">
            Bakiye yükle →
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Siparişlerim</p>
          <p className="mt-1 text-3xl font-black text-[#33353E]">{orderCount}</p>
          <Link href="/panel/siparisler" className="mt-3 inline-block text-xs font-bold text-[#7844E4]">Tümünü gör →</Link>
        </div>
        <Link href="/hizmetler" className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-2">
          <p className="text-xs font-bold uppercase text-[#7844E4]">Hızlı işlem</p>
          <p className="mt-1 text-lg font-black text-[#33353E]">Yeni sipariş ver</p>
          <p className="mt-1 text-sm text-[#666F94]">Instagram, TikTok, YouTube ve daha fazlası — bakiyeden anında öde.</p>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link href="/hizmetler" className="rounded-xl bg-[#7844E4] px-4 py-2 text-xs font-bold text-white hover:bg-[#6835d3]">
            + Sipariş Ver
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[#E9EBF5] p-8 text-center">
            <p className="text-sm text-[#666F94]">Henüz siparişiniz yok.</p>
            <Link href="/hizmetler" className="mt-3 inline-block text-sm font-bold text-[#7844E4]">İlk siparişinizi verin →</Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[#E9EBF5]">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-mono font-bold text-[#33353E]">{o.code}</span>
                <span className="text-[#666F94]">{getService(o.serviceSlug)?.title ?? o.serviceSlug}</span>
                <span className="rounded-full bg-[#EDE5FF] px-2.5 py-0.5 text-xs font-bold text-[#7844E4]">
                  {STATUS_LABELS[o.status] ?? o.status}
                </span>
                <span className="font-semibold">{formatPrice(o.price)} ₺</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
