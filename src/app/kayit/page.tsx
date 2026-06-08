'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Kayıt başarısız')
      router.push('/panel')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-black text-[#33353E]">Kayıt Ol</h1>
      <p className="mt-2 text-sm text-[#666F94]">Ücretsiz hesap — yeni üyelere özel avantajlar</p>

      <a href="/api/auth/google?next=/panel" className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[#E9EBF5] bg-white py-3 text-sm font-semibold hover:bg-[#F0F1F9]">
        Google ile Kayıt Ol
      </a>

      <div className="my-4 flex items-center gap-3 text-xs text-[#666F94]">
        <div className="h-px flex-1 bg-[#E9EBF5]" /> veya <div className="h-px flex-1 bg-[#E9EBF5]" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Ad Soyad</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]" />
        </div>
        <div>
          <label className="block text-sm font-medium">E-posta</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]" />
        </div>
        <div>
          <label className="block text-sm font-medium">Şifre (min 6)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5 w-full rounded-xl border border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#7844E4] py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#666F94]">
        Zaten hesabınız var mı? <Link href="/giris" className="font-bold text-[#7844E4]">Giriş yapın</Link>
      </p>
    </main>
  )
}
