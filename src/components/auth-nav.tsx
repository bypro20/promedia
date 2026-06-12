'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function AuthNav() {
  const [user, setUser] = useState<{ role: string; balance: number } | null>(null)

  useEffect(() => {
    void fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setUser(d.user)
      })
      .catch(() => {})
  }, [])

  if (!user) {
    return (
      <>
        <Link
          href="/kayit"
          className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-[#7844E4] hover:bg-[#EDE5FF] sm:inline-flex md:px-4"
        >
          Kayıt Ol
        </Link>
        <Link
          href="/giris"
          className="hidden rounded-2xl border-4 border-[#E4DAFA] bg-[#7844E4] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6835d3] sm:inline-flex md:px-6 md:py-3 md:text-base"
        >
          Giriş Yap
        </Link>
      </>
    )
  }

  const href = user.role === 'admin' ? '/admin' : '/panel'
  return (
    <Link
      href={href}
      className="hidden rounded-2xl border-4 border-[#E4DAFA] bg-[#7844E4] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6835d3] sm:inline-flex md:px-6 md:py-3 md:text-base"
    >
      {user.role === 'admin' ? 'Admin' : 'Panel'} · {user.balance.toFixed(0)} ₺
    </Link>
  )
}
