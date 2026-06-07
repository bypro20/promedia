'use client'

import { useState } from 'react'

export default function OrderLookupPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult('Sipariş sistemi henüz bağlanmadı. Ödeme entegrasyonu sonrası buradan sorgulayabileceksiniz.')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sipariş Sorgula</h1>
      <p className="mt-2 text-sm text-muted">
        Sipariş kodunuzu girerek durumunu kontrol edin.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium">
            Sipariş kodu
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PM-123456"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Sorgula
        </button>
      </form>

      {result && (
        <p className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted">
          {result}
        </p>
      )}
    </main>
  )
}
