import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/format'

export default async function AdminDashboard() {
  const [userCount, orderCount, revenue, pending] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { price: true } }),
    prisma.order.count({ where: { status: { in: ['pending', 'processing', 'in_progress'] } } }),
  ])

  const cards = [
    { label: 'Kullanıcılar', value: userCount, color: '#7844E4' },
    { label: 'Toplam Sipariş', value: orderCount, color: '#3382FA' },
    { label: 'Ciro', value: `${formatPrice(revenue._sum.price ?? 0)} ₺`, color: '#10B981' },
    { label: 'Aktif Sipariş', value: pending, color: '#FD5501' },
  ]

  const recent = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { email: true } } } })

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black text-[#33353E]">Admin Dashboard</h1>
      <p className="text-sm text-[#666F94]">ProMedia yönetim merkezi</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase text-[#666F94]">{c.label}</p>
            <p className="mt-1 text-2xl font-black" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Son Siparişler</h2>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="w-full">
            <thead><tr className="text-left text-xs text-[#666F94]"><th className="pb-2">Kod</th><th className="pb-2">Kullanıcı</th><th className="pb-2">Durum</th><th className="pb-2">Tutar</th></tr></thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-[#E9EBF5]">
                  <td className="py-2 font-mono text-xs">{o.code}</td>
                  <td className="py-2">{o.user?.email ?? o.email ?? 'Misafir'}</td>
                  <td className="py-2">{o.status}</td>
                  <td className="py-2">{formatPrice(o.price)} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
