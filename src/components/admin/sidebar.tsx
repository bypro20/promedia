'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/siparisler', label: 'Siparişler', icon: '📦' },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: '👥' },
  { href: '/admin/bakiye', label: 'Bakiye Yönetimi', icon: '💰' },
  { href: '/admin/smm', label: 'SMM Paneller', icon: '🔌' },
  { href: '/admin/destek', label: 'Destek Talepleri', icon: '💬' },
  { href: '/admin/ayarlar', label: 'Site Ayarları', icon: '⚙️' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/'
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#1e2235] bg-[#282D40] text-white">
      <div className="border-b border-white/10 p-5">
        <p className="text-lg font-black">Admin Panel</p>
        <p className="text-xs text-white/50">ProMedia Yönetim</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                active ? 'bg-[#7844E4] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" className="mb-2 block rounded-xl px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
          ← Siteye Dön
        </Link>
        <button type="button" onClick={logout} className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/70 hover:bg-white/10">
          Çıkış
        </button>
      </div>
    </aside>
  )
}
