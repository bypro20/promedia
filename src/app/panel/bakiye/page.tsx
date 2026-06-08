'use client'

import { useEffect, useState } from 'react'

type Tx = { id: string; type: string; amount: number; balance: number; note: string | null; createdAt: string }

export default function PanelBalancePage() {
  const [balance, setBalance] = useState(0)
  const [txs, setTxs] = useState<Tx[]>([])
  const [amount, setAmount] = useState('100')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/panel/balance').then((r) => r.json()).then((d) => {
      if (d.ok) { setBalance(d.balance); setTxs(d.transactions) }
    })
  }, [])

  async function requestDeposit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/panel/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Bakiye</h1>
      <p className="mt-4 text-3xl font-black text-[#7844E4]">{balance.toFixed(2)} ₺</p>

      <form onSubmit={requestDeposit} className="mt-8 max-w-md rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Bakiye Yükleme Talebi</h2>
        <p className="mt-1 text-xs text-[#666F94]">Talebiniz admin onayından sonra bakiyenize eklenir (Havale/Papara).</p>
        <input type="number" min={10} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-4 w-full rounded-xl border border-[#E9EBF5] px-3 py-2.5 text-sm" />
        <button type="submit" className="mt-3 w-full rounded-xl bg-[#7844E4] py-2.5 text-sm font-bold text-white">Talep Gönder</button>
        {msg && <p className="mt-3 text-sm text-[#666F94]">{msg}</p>}
      </form>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">İşlem Geçmişi</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {txs.map((t) => (
            <li key={t.id} className="flex justify-between border-b border-[#E9EBF5] py-2">
              <span>{t.note ?? t.type}</span>
              <span className={t.amount >= 0 ? 'text-green-600' : 'text-red-600'}>{t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)} ₺</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
