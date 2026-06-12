'use client'

import type { WholesaleOverview } from '@/lib/smm/wholesale-overview'

type Props = { overview: WholesaleOverview; configured: boolean }

function fmt(n: number) {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 2 })
}

function TierBadge({ tier }: { tier: 'wholesale' | 'reseller' | 'unknown' }) {
  if (tier === 'wholesale') return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">Toptan</span>
  if (tier === 'reseller') return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Aracı</span>
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">—</span>
}

export function SmmWholesaleOverview({ overview, configured }: Props) {
  const { flow, catalogStats, providerBreakdown, orderStats, recentOrders, fees, demoMode } = overview

  return (
    <div className="mt-6 space-y-6">
      {demoMode && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Demo mod</strong> — gerçek toptancıya sipariş gitmiyor. API key ekleyin.
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black">Sistem akışı</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {flow.map((f) => (
            <div key={f.step} className="rounded-xl border border-[#E9EBF5] bg-[#F0F1F9]/50 p-4">
              <p className="text-xs font-black text-[#7844E4]">Adım {f.step}</p>
              <p className="mt-1 text-sm font-bold">{f.title}</p>
              <p className="mt-2 text-xs text-[#666F94]">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Ort. katalog karı" value={`%${fees.example.marginPercent}`} sub={`Min. %${fees.minProfitPercent}`} />
        <Card label="Örnek kar / sipariş" value={`₺${fmt(fees.example.profitTry)}`} sub={`Satış ₺${fees.example.sellTry} − ₺${fmt(fees.example.costTry)}`} />
        <Card label="Toplam ciro" value={`₺${fmt(orderStats.revenueTry)}`} sub={`${orderStats.paidOrders} sipariş`} />
        <Card label="Tahmini net kar" value={`₺${fmt(orderStats.estimatedProfitTry)}`} sub={`Marj %${orderStats.avgMarginPercent}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Ne kesiliyor?</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong>Toptan maliyet:</strong> {fees.marginFormula}</li>
            <li><strong>Min. kar marjınız:</strong> %{fees.minProfitPercent}</li>
            <li><strong>PayTR (müşteri):</strong> {fees.paytrRateLabel} + ₺{fees.paytrFixedTry}</li>
            <li><strong>Aracı komisyon:</strong> {fees.preferWholesale ? 'Yok — toptan öncelikli' : 'Aracı panel maliyete eklenir'}</li>
            <li><strong>USD/TRY:</strong> ₺{fees.usdTry}</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Eşleme</h2>
          <p className="mt-2 text-sm">Toptan: {catalogStats.mappedWholesale} · Aracı: {catalogStats.mappedReseller} · Eşlenmemiş: {catalogStats.unmapped}</p>
          <p className="mt-2 text-sm text-amber-700">Düşük marj: {catalogStats.lowMarginCount} servis</p>
        </div>
      </div>

      {configured && providerBreakdown.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm overflow-x-auto">
          <h2 className="font-bold">Panel bakiyeleri</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-[#666F94]">
                <th className="p-2">Panel</th><th className="p-2">Tip</th><th className="p-2">Bakiye</th><th className="p-2">Servis</th>
              </tr>
            </thead>
            <tbody>
              {providerBreakdown.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2 font-semibold">{p.name}</td>
                  <td className="p-2"><TierBadge tier={p.tier} /></td>
                  <td className="p-2 font-mono">{p.balanceOk ? `${p.balance} ${p.currency ?? ''}` : (p.error ?? 'Hata')}</td>
                  <td className="p-2">{p.mappedServices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm overflow-x-auto">
        <h2 className="font-bold">Son siparişler — kar</h2>
        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-[#666F94]">Henüz sipariş yok.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-[#666F94]">
                <th className="p-2">Kod</th><th className="p-2">Satış</th><th className="p-2">Maliyet</th><th className="p-2">Kar</th><th className="p-2">Marj</th><th className="p-2">Kaynak</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.code} className="border-b">
                  <td className="p-2 font-mono text-xs">{o.code}</td>
                  <td className="p-2">₺{fmt(o.sellPrice)}</td>
                  <td className="p-2">{o.estimatedCost != null ? `₺${fmt(o.estimatedCost)}` : '—'}</td>
                  <td className="p-2 text-green-600 font-bold">{o.profit != null ? `₺${fmt(o.profit)}` : '—'}</td>
                  <td className="p-2">{o.marginPercent != null ? `%${o.marginPercent}` : '—'}</td>
                  <td className="p-2"><TierBadge tier={o.providerTier} /> {o.providerName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-[#666F94]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#7844E4]">{value}</p>
      <p className="mt-1 text-xs text-[#666F94]">{sub}</p>
    </div>
  )
}
