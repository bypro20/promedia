'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  IconClose,
  IconDashboard,
  IconLogout,
  IconMenu,
  IconOrders,
  IconPlug,
  IconSettings,
  IconShield,
  IconSupport,
  IconUsers,
  IconWallet,
} from '@/components/icons'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: IconDashboard },
  { href: '/admin/bakiye', label: 'Bakiye Talepleri', icon: IconWallet, badge: true },
  { href: '/admin/siparisler', label: 'Siparişler', icon: IconOrders },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: IconUsers },
  { href: '/admin/guvenlik', label: 'Güvenlik', icon: IconShield },
  { href: '/admin/hizmetler', label: 'Hizmetler', icon: IconOrders },
  { href: '/admin/smm', label: 'SMM Paneller', icon: IconPlug },
  { href: '/admin/destek', label: 'Destek', icon: IconSupport },
  { href: '/admin/islemler', label: 'İşlemler', icon: IconWallet },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: IconSettings },
]

type Props = { adminEmail: string; children: React.ReactNode }

function NavLinks({ pathname, onNavigate, pendingDeposits }: { pathname: string; onNavigate?: () => void; pendingDeposits: number }) {
  return (
    <>
      {LINKS.map((l) => {
        const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
        const Icon = l.icon
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? 'bg-[#7844E4] text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">{l.label}</span>
            {l.badge && pendingDeposits > 0 && (
              <span className="rounded-full bg-[#FD5501] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingDeposits}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

export function AdminShell({ adminEmail, children }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendingDeposits, setPendingDeposits] = useState(0)

  useEffect(() => {
    void fetch('/api/admin/deposits?pending=1')
      .then((r) => r.json())
      .then((d) => { if (d.ok) setPendingDeposits(d.pendingCount) })
  }, [pathname])

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/admin/giris'
  }

  return (
    <div className="flex min-h-screen bg-[#1a1d2e]">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#282D40] lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2">
            <IconShield className="h-5 w-5 text-[#7844E4]" />
            <div>
              <p className="text-base font-black text-white">Yönetim</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">ProMedia Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          <NavLinks pathname={pathname} pendingDeposits={pendingDeposits} />
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link href="/hizmetler" className="mb-1 block rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white">
            + Sipariş Ver
          </Link>
          <Link href="/" className="mb-1 block rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white">
            ← Ana Site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white"
          >
            <IconLogout className="h-[18px] w-[18px]" />
            Çıkış
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-[#282D40] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <span className="font-black text-white">Admin</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10">
                <IconClose />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              <NavLinks pathname={pathname} pendingDeposits={pendingDeposits} onNavigate={() => setMobileOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#282D40]/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
            >
              <IconMenu />
            </button>
            <div>
              <p className="text-sm font-semibold text-white">Yönetim Paneli</p>
              <p className="text-xs text-white/40">{adminEmail}</p>
            </div>
          </div>
          <span className="rounded-lg bg-[#7844E4]/20 px-3 py-1.5 text-xs font-bold text-[#7844E4]">ADMIN</span>
        </header>
        <div className="flex-1 overflow-auto bg-[#F0F1F9]">{children}</div>
      </div>
    </div>
  )
}
