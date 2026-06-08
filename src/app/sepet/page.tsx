'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cartTotal, getCart, removeFromCart, type CartItem } from '@/lib/cart'
import { formatPrice } from '@/lib/format'

export default function SepetPage() {
  const [items, setItems] = useState<CartItem[]>([])

  function refresh() {
    setItems(getCart())
  }

  useEffect(() => {
    refresh()
    window.addEventListener('pm-cart-updated', refresh)
    return () => window.removeEventListener('pm-cart-updated', refresh)
  }, [])

  return (
    <main className="py-12">
      <div className="sd-container max-w-2xl">
        <h1 className="text-2xl font-black">Sepet</h1>
        <p className="mt-1 text-sm text-[#666F94]">Paketleri kaydedin, hizmet sayfasından siparişi tamamlayın.</p>
        {items.length === 0 ? (
          <p className="mt-4 text-[#666F94]">
            Sepetiniz boş. <Link href="/hizmetler" className="font-bold text-[#7844E4]">Hizmetlere göz atın</Link>
          </p>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {items.map((item, i) => (
                <li key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="font-bold">{item.serviceTitle}</p>
                  <p className="text-sm text-[#666F94]">{item.amount.toLocaleString('tr-TR')} {item.unit} · {formatPrice(item.price)} ₺</p>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/${item.serviceSlug}`} className="text-xs font-bold text-[#7844E4]">Siparişi tamamla →</Link>
                    <button type="button" onClick={() => { removeFromCart(i); refresh() }} className="text-xs font-bold text-red-600">Kaldır</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#EDE5FF] p-4">
              <span className="font-bold">Toplam</span>
              <span className="text-xl font-black text-[#7844E4]">{formatPrice(cartTotal(items))} ₺</span>
            </div>
            <Link href="/giris?next=/panel" className="mt-4 block w-full rounded-xl bg-[#7844E4] py-3 text-center font-bold text-white">
              Giriş Yap / Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
