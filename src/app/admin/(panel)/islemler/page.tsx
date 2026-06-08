'use client'

import { useEffect, useState } from 'react'

type Tx = {
  id: string
  amount: number
  balance: number
  type: string
  note: string | null
  createdAt: string
  user: { email: string }
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Tx[]>([])

  useEffect(() => {
    void fetch('/api/admin/deposits').then((r) => r.json()).then((d) => {
      if (d.ok) setTransactions(d.recentTransactions)
    })
  }, [])

  return (
    <main className="p-4 lg:p-8">
      <h1 className="text-2xl font-black text-[#33353E]">İşlem Geçmişi</h1>
      <p className="mt-1 text-sm text-[#666F94]">Tüm kullanıcıların bakiye hareketleri (yükleme, sipariş).</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-[#666F94]">
              <th className="p-3">Tarih</th>
              <th className="p-3">Kullanıcı</th>
              <th className="p-3">Tür</th>
              <th className="p-3">Not</th>
              <th className="p-3">Tutar</th>
              <th className="p-3">Bakiye sonrası</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-[#E9EBF5]">
                <td className="p-3 text-xs text-[#666F94]">{new Date(t.createdAt).toLocaleString('tr-TR')}</td>
                <td className="p-3 font-medium">{t.user.email}</td>
                <td className="p-3">{t.type}</td>
                <td className="p-3 max-w-[200px] truncate text-[#666F94]">{t.note ?? '—'}</td>
                <td className={`p-3 font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)} ₺
                </td>
                <td className="p-3">{t.balance.toFixed(2)} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <p className="p-8 text-center text-[#666F94]">Henüz işlem yok.</p>
        )}
      </div>
    </main>
  )
}
