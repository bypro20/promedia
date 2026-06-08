'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  IconClose,
  IconDashboard,
  IconKey,
  IconLogout,
  IconMenu,
  IconOrders,
  IconRefresh,
  IconSupport,
  IconUser,
  IconWallet,
} from '@/components/icons'

const LINKS = [
  { href: '/panel', label: 'Genel Bakış', icon: IconDashboard },
  { href: '/hizmetler', label: 'Yeni Sipariş', icon: IconOrders, external: true },
  { href: '/panel/siparisler', label: 'Siparişlerim', icon: IconOrders },
  { href: '/panel/bakiye', label: 'Bakiye Yükle', icon: IconWallet },
  { href: '/panel/telafi', label: 'Telafi', icon: IconRefresh },
  { href: '/panel/destek', label: 'Destek', icon: IconSupport },
  { href: '/panel/profil', label: 'Profil', icon: IconUser },
]

const SECONDARY_LINKS = [
  { href: '/panel/api', label: 'API (Bayi)', icon: IconKey },
]

type Props = { user: { name: string | null; email: string; balance: number } }

function initials(name: string | null, email: string) {
  if (name) return name.slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map((l) => {
        const active = !l.external && (pathname === l.href || (l.href !== '/panel' && pathname.startsWith(l.href)))
        const Icon = l.icon
        const cls = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? 'bg-[#7844E4] text-white shadow-sm shadow-[#7844E4]/25'
            : 'text-[#666F94] hover:bg-[#F0F1F9] hover:text-[#33353E]'
        }`
        if (l.external) {
          return (
            <a key={l.href} href={l.href} onClick={onNavigate} className={cls}>
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {l.label}
            </a>
          )
        }
        return (
          <Link key={l.href} href={l.href} onClick={onNavigate} className={cls}>
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {l.label}
          </Link>
        )
      })}
      <div className="my-2 border-t border-[#E9EBF5]" />
      {SECONDARY_LINKS.map((l) => {
        const active = pathname.startsWith(l.href)
        const Icon = l.icon
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? 'bg-[#EDE5FF] text-[#7844E4]' : 'text-[#666F94] hover:bg-[#F0F1F9]'
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {l.label}
          </Link>
        )
      })}
    </>
  )
}

export function PanelShell({ user, children }: Props & { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/'
  }

  const displayName = user.name ?? user.email.split('@')[0]

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#E9EBF5] bg-white lg:flex">
        <div className="border-b border-[#E9EBF5] px-5 py-5">
          <Link href="/panel" className="text-lg font-black tracking-tight text-[#33353E]">
            Pro<span className="text-[#7844E4]">Media</span>
          </Link>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#666F94]">Müşteri Paneli</p>
        </div>
        <div className="border-b border-[#E9EBF5] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE5FF] text-sm font-bold text-[#7844E4]">
              {initials(user.name, user.email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#33353E]">{displayName}</p>
              <p className="truncate text-xs text-[#666F94]">{user.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="border-t border-[#E9EBF5] p-3">
          <Link
            href="/hizmetler"
            className="mb-1 flex items-center justify-center gap-2 rounded-lg bg-[#7844E4] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#6835d3]"
          >
            + Yeni Sipariş
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#666F94] hover:bg-[#F0F1F9]"
          >
            <IconLogout className="h-[18px] w-[18px]" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E9EBF5] px-4 py-4">
              <span className="font-black text-[#33353E]">Pro<span className="text-[#7844E4]">Media</span></span>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-[#666F94] hover:bg-[#F0F1F9]">
                <IconClose />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#E9EBF5] bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[#666F94] hover:bg-[#F0F1F9] lg:hidden"
            >
              <IconMenu />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#33353E]">{displayName}</p>
              <p className="text-xs text-[#666F94]">Müşteri hesabınız</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EDE5FF] px-4 py-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7844E4]">Bakiye</p>
              <p className="text-sm font-black text-[#7844E4]">{user.balance.toFixed(2)} ₺</p>
            </div>
            <Link href="/hizmetler" className="hidden rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6835d3] sm:inline-flex">
              Sipariş Ver
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
