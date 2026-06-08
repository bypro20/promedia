'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function AuthNav() {
  const [user, setUser] = useState<{ role: string; balance: number } | null>(null)

  useEffect(() => {
    void fetch('/api/auth').then((r) => r.json()).then((d) => {
      if (d.ok) setUser(d.user)
    })
  }, [])

  if (!user) {
    return (
      <>
        <Link href="/kayit" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-[#7844E4] hover:bg-[#EDE5FF] md:inline-flex">
          Kayıt Ol
        </Link>
        <Link href="/giris" className="hidden rounded-2xl border-4 border-[#E4DAFA] bg-[#7844E4] px-6 py-3 text-base font-medium text-white hover:bg-[#6835d3] md:inline-flex">
          Giriş Yap
        </Link>
      </>
    )
  }

  const href = user.role === 'admin' ? '/admin' : '/panel'
  return (
    <Link href={href} className="hidden rounded-2xl border-4 border-[#E4DAFA] bg-[#7844E4] px-6 py-3 text-base font-medium text-white hover:bg-[#6835d3] md:inline-flex">
      {user.role === 'admin' ? 'Admin' : 'Panel'} · {user.balance.toFixed(0)} ₺
    </Link>
  )
}
