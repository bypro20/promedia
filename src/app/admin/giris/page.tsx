'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { IconShield } from '@/components/icons'

function AdminLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(() => {
    const err = params.get('error')
    if (err === 'forbidden') return 'Bu hesap yönetici yetkisine sahip değil'
    if (err === 'denied') return 'Giriş reddedildi'
    return null
  })
  const [loading, setLoading] = useState(false)
  const next = params.get('next') ?? '/admin'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password, portal: 'admin' }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Giriş başarısız')
      router.push(next.startsWith('/admin') ? next : '/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80">Yönetici e-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7844E4] focus:ring-1 focus:ring-[#7844E4]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80">Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#7844E4] focus:ring-1 focus:ring-[#7844E4]"
        />
      </div>
      {error && <p className="rounded-lg bg-red-500/10 p-2 text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#7844E4] py-3 text-sm font-bold text-white hover:bg-[#6835d3] disabled:opacity-60"
      >
        {loading ? 'Giriş yapılıyor…' : 'Yönetim Paneline Giriş'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1d2e] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#282D40] p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7844E4]/20 text-[#7844E4]">
            <IconShield />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Yönetim Girişi</h1>
            <p className="text-xs text-white/50">ProMedia Admin Portal</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/60">
          Bu alan yalnızca yetkili yöneticiler içindir. Müşteri girişi için{' '}
          <Link href="/giris" className="font-semibold text-[#7844E4] hover:underline">
            müşteri paneli
          </Link>
          {' '}kullanın.
        </p>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
        <Link href="/" className="mt-6 block text-center text-xs text-white/40 hover:text-white/60">
          ← Ana siteye dön
        </Link>
      </div>
    </main>
  )
}
