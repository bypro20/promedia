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
        <p className="mt-1 text-sm text-[#666F94]">Sepetinizdeki paketleri inceleyin ve güvenli ödeme ile satın alın.</p>
        {items.length === 0 ? (
          <p className="mt-4 text-[#666F94]">
            Sepetiniz boş. <Link href="/hizmetler" className="font-bold text-[#7844E4]">Hizmetlere göz atın</Link>
          </p>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {items.map((item, i) => (
                <li key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.serviceTitle}</p>
                      <p className="text-sm text-[#666F94]">{item.amount.toLocaleString('tr-TR')} {item.unit}</p>
                    </div>
                    <p className="text-lg font-black text-[#7844E4]">{formatPrice(item.price)} ₺</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/${item.serviceSlug}`}
                      className="rounded-xl bg-[#7844E4] px-4 py-2 text-xs font-bold text-white hover:bg-[#6835d3]"
                    >
                      Satın Al
                    </Link>
                    <button type="button" onClick={() => { removeFromCart(i); refresh() }} className="rounded-xl border px-4 py-2 text-xs font-bold text-red-600">
                      Kaldır
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#EDE5FF] p-4">
              <span className="font-bold">Toplam</span>
              <span className="text-xl font-black text-[#7844E4]">{formatPrice(cartTotal(items))} ₺</span>
            </div>
            <p className="mt-3 text-center text-xs text-[#666F94]">
              Her paket için ilgili hizmet sayfasından iyzico ile güvenli ödeme yapabilirsiniz.
            </p>
            {items[0] && (
              <Link
                href={`/${items[0].serviceSlug}`}
                className="mt-4 block w-full rounded-xl bg-[#7844E4] py-3 text-center font-bold text-white hover:bg-[#6835d3]"
              >
                İlk Paketi Satın Al — {formatPrice(items[0].price)} ₺
              </Link>
            )}
          </>
        )}
      </div>
    </main>
  )
}
