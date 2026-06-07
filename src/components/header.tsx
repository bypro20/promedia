'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'
import { TopBar } from './top-bar'

const NAV = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Organik Büyüme', href: '/instagram-takipci-satin-al' },
  { label: 'Blog', href: '#' },
  { label: 'Ücretsiz Araçlar', href: '#' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <div className="mx-auto flex h-[62px] max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c3ce7] to-[#e91e8c] text-sm font-black text-white shadow-lg">
              PM
            </span>
            <span className="text-xl font-black tracking-tight">
              Pro<span className="gradient-text">Media</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.label === 'Hizmetler' ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-purple-light hover:text-purple">
                    Hizmetler
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {megaOpen && (
                    <div className="absolute left-1/2 top-full z-50 w-[860px] -translate-x-1/2 pt-1">
                      <div className="rounded-2xl border border-border bg-white p-6 shadow-2xl">
                        <p className="mb-4 text-xs font-black uppercase tracking-widest text-purple">
                          En Çok Kullanılan Kategorilerimiz
                        </p>
                        <div className="grid grid-cols-4 gap-5">
                          {PLATFORM_SERVICES.map((group) => (
                            <div key={group.platform}>
                              <p className={`mb-2 flex items-center gap-1.5 bg-gradient-to-r ${group.color} bg-clip-text text-sm font-black text-transparent`}>
                                {group.icon} {group.platform}
                              </p>
                              <ul className="space-y-0.5">
                                {group.items.map((s) => (
                                  <li key={s.href}>
                                    <Link href={s.href} className="block rounded-md px-2 py-1 text-xs text-muted hover:bg-purple-light hover:font-semibold hover:text-purple">
                                      {s.name.replace(`${group.platform} `, '')}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <Link href="/hizmetler" className="mt-2 block px-2 text-xs font-bold text-purple hover:underline">
                                Tümünü Görüntüle →
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-purple-light hover:text-purple">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Sağ ikonlar */}
          <div className="flex items-center gap-2">
            <Link href="/siparis-sorgula" className="hidden rounded-lg p-2 text-muted hover:bg-purple-light hover:text-purple sm:flex" title="Sipariş Sorgula">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/telafi-talebi" className="hidden rounded-lg p-2 text-muted hover:bg-purple-light hover:text-purple sm:flex" title="Telafi">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Link>
            <Link href="#" className="hidden rounded-lg px-3 py-2 text-sm font-semibold hover:text-purple sm:block">
              Giriş Yap
            </Link>
            <Link href="/instagram-takipci-satin-al" className="gradient-btn hidden rounded-full px-5 py-2.5 text-sm font-bold text-white md:inline-flex">
              Sipariş Ver
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-purple-light" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/siparis-sorgula" className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-purple-light" onClick={() => setMobileOpen(false)}>Sipariş Sorgula</Link>
            <Link href="/telafi-talebi" className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-purple-light" onClick={() => setMobileOpen(false)}>Telafi Talebi</Link>
          </div>
        )}
      </header>
    </>
  )
}
