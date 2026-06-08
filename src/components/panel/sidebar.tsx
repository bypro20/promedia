'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/panel', label: 'Genel Bakış', icon: '📊' },
  { href: '/panel/siparisler', label: 'Siparişlerim', icon: '📦' },
  { href: '/panel/bakiye', label: 'Bakiye', icon: '💰' },
  { href: '/panel/telafi', label: 'Telafi', icon: '🔄' },
  { href: '/panel/api', label: 'API Anahtarı', icon: '🔑' },
  { href: '/panel/destek', label: 'Destek', icon: '💬' },
  { href: '/panel/profil', label: 'Profil', icon: '👤' },
]

type Props = { user: { name: string | null; email: string; balance: number } }

export function PanelSidebar({ user }: Props) {
  const pathname = usePathname()

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/'
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#E9EBF5] bg-white">
      <div className="border-b border-[#E9EBF5] p-5">
        <Link href="/" className="text-lg font-black text-[#33353E]">
          Pro<span className="text-[#7844E4]">Media</span>
        </Link>
        <p className="mt-1 truncate text-xs text-[#666F94]">{user.email}</p>
        <p className="mt-2 text-sm font-bold text-[#7844E4]">{user.balance.toFixed(2)} ₺ bakiye</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? 'bg-[#EDE5FF] text-[#7844E4]' : 'text-[#666F94] hover:bg-[#F0F1F9]'
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[#E9EBF5] p-3">
        <Link href="/hizmetler" className="mb-2 block rounded-xl px-3 py-2 text-sm font-semibold text-[#7844E4] hover:bg-[#EDE5FF]">
          + Yeni Sipariş
        </Link>
        <button type="button" onClick={logout} className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#666F94] hover:bg-[#F0F1F9]">
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
