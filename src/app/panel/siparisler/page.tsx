import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatPrice } from '@/lib/format'
import { getService } from '@/lib/catalog'

export default async function PanelOrdersPage() {
  const user = await getSession()
  if (!user) redirect('/giris')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Siparişlerim</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-[#666F94]">Sipariş yok. <Link href="/hizmetler" className="text-[#7844E4] font-bold">Hizmetlere git</Link></p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-[#7844E4]">{o.code}</span>
                <span className="rounded-full bg-[#EDE5FF] px-3 py-1 text-xs font-bold">{STATUS_LABELS[o.status] ?? o.status}</span>
              </div>
              <p className="mt-2 font-semibold">{getService(o.serviceSlug)?.title ?? o.serviceSlug}</p>
              <p className="text-sm text-[#666F94]">{o.amount.toLocaleString('tr-TR')} adet · {formatPrice(o.price)} ₺</p>
              <p className="mt-1 truncate text-xs text-[#666F94]">{o.target}</p>
              {o.smmStatus && <p className="mt-1 text-xs">SMM: {o.smmStatus}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
