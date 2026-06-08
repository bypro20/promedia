'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/format'

type Stats = {
  users: number
  admins: number
  orders: number
  revenue: number
  activeOrders: number
  pendingDeposits: number
  openSupport: number
  adminBalance: number
  smmConfigured: boolean
}

type Order = { id: string; code: string; status: string; price: number; user: { email: string } | null; email: string | null }
type Deposit = { id: string; amount: number; method: string; user: { email: string; balance: number } }

const QUICK = [
  { href: '/admin/bakiye', label: 'Bakiye Talepleri', desc: 'Onayla / reddet / manuel yükle', color: '#10B981' },
  { href: '/admin/siparisler', label: 'Siparişler', desc: 'Tüm siparişler & SMM durumu', color: '#3382FA' },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', desc: 'Rol, engelle, bakiye görüntüle', color: '#7844E4' },
  { href: '/admin/hizmetler', label: 'Hizmet Kataloğu', desc: 'Tüm servisler & fiyatlar', color: '#FD5501' },
  { href: '/admin/smm', label: 'SMM Paneller', desc: 'API key & provider bakiye', color: '#6366F1' },
  { href: '/admin/destek', label: 'Destek', desc: 'Müşteri destek talepleri', color: '#EC4899' },
  { href: '/admin/islemler', label: 'İşlem Geçmişi', desc: 'Tüm bakiye hareketleri', color: '#14B8A6' },
  { href: '/admin/ayarlar', label: 'Ayarlar', desc: 'OAuth, site URL', color: '#666F94' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])

  useEffect(() => {
    void fetch('/api/admin/stats').then((r) => r.json()).then((d) => {
      if (d.ok) {
        setStats(d.stats)
        setOrders(d.recentOrders)
        setDeposits(d.pendingDeposits)
      }
    })
  }, [])

  if (!stats) {
    return <main className="p-8 text-sm text-[#666F94]">Yükleniyor…</main>
  }

  const cards = [
    { label: 'Müşteriler', value: stats.users, href: '/admin/kullanicilar' },
    { label: 'Toplam Sipariş', value: stats.orders, href: '/admin/siparisler' },
    { label: 'Ciro', value: `${formatPrice(stats.revenue)} ₺`, href: '/admin/siparisler' },
    { label: 'Bekleyen Bakiye', value: stats.pendingDeposits, href: '/admin/bakiye', alert: stats.pendingDeposits > 0 },
    { label: 'Açık Destek', value: stats.openSupport, href: '/admin/destek' },
    { label: 'Admin Bakiyeniz', value: `${formatPrice(stats.adminBalance)} ₺`, href: '/admin/bakiye' },
    { label: 'Aktif Sipariş', value: stats.activeOrders, href: '/admin/siparisler' },
    { label: 'SMM', value: stats.smmConfigured ? 'Bağlı ✓' : 'Key gerekli', href: '/admin/smm' },
  ]

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#33353E]">Yönetim Merkezi</h1>
          <p className="mt-1 text-sm text-[#666F94]">Site, kullanıcılar, bakiye, siparişler ve SMM — tek panelden yönetim.</p>
        </div>
        <Link href="/hizmetler" className="rounded-xl bg-[#7844E4] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6835d3]">
          + Sipariş Ver (Hizmetler)
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md ${c.alert ? 'ring-2 ring-[#FD5501]' : ''}`}
          >
            <p className="text-xs font-bold uppercase text-[#666F94]">{c.label}</p>
            <p className="mt-1 text-2xl font-black text-[#33353E]">{c.value}</p>
          </Link>
        ))}
      </div>

      {deposits.length > 0 && (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-amber-900">Bekleyen Bakiye Yükleme Talepleri</h2>
            <Link href="/admin/bakiye" className="text-sm font-bold text-[#7844E4]">Tümünü yönet →</Link>
          </div>
          <ul className="mt-3 space-y-2">
            {deposits.map((d) => (
              <li key={d.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm">
                <span className="font-medium">{d.user.email}</span>
                <span className="font-bold text-[#7844E4]">{d.amount.toFixed(2)} ₺ · {d.method}</span>
                <span className="text-xs text-[#666F94]">Mevcut: {d.user.balance.toFixed(2)} ₺</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 font-bold text-[#33353E]">Hızlı Erişim</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md">
              <p className="font-bold" style={{ color: q.color }}>{q.label}</p>
              <p className="mt-1 text-xs text-[#666F94]">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm font-bold text-[#7844E4]">Tümü →</Link>
        </div>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#666F94]">
                <th className="pb-2">Kod</th>
                <th className="pb-2">Kullanıcı</th>
                <th className="pb-2">Durum</th>
                <th className="pb-2">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[#E9EBF5]">
                  <td className="py-2 font-mono text-xs">{o.code}</td>
                  <td className="py-2">{o.user?.email ?? o.email ?? 'Misafir'}</td>
                  <td className="py-2">{o.status}</td>
                  <td className="py-2">{formatPrice(o.price)} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/" className="rounded-2xl bg-white p-4 text-sm shadow-sm hover:shadow-md">
          <p className="font-bold text-[#33353E]">Ana Site</p>
          <p className="text-[#666F94]">Canlı siteyi görüntüle</p>
        </Link>
        <Link href="/hizmetler" className="rounded-2xl bg-white p-4 text-sm shadow-sm hover:shadow-md">
          <p className="font-bold text-[#33353E]">Hizmetler Sayfası</p>
          <p className="text-[#666F94]">Admin hesabıyla sipariş ver</p>
        </Link>
        <Link href="/siparis-sorgula" className="rounded-2xl bg-white p-4 text-sm shadow-sm hover:shadow-md">
          <p className="font-bold text-[#33353E]">Sipariş Sorgula</p>
          <p className="text-[#666F94]">Genel sorgu aracı</p>
        </Link>
      </section>
    </main>
  )
}
