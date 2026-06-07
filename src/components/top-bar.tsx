import Link from 'next/link'

export function TopBar() {
  return (
    <>
      <div className="bg-[#5521c9] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6">
          <Link href="#" className="hover:text-pink-300">İletişim</Link>
          <div className="flex gap-4">
            <Link href="/telafi-talebi" className="hover:text-pink-300">Telafi Talebi</Link>
            <Link href="/siparis-sorgula" className="hover:text-pink-300">Sipariş Sorgula</Link>
          </div>
        </div>
      </div>
      {/* Promo band — SosyalDigital gibi */}
      <div className="bg-gradient-to-r from-purple via-[#9b59f7] to-pink px-4 py-2 text-center text-xs font-bold text-white sm:text-sm">
        🎁 Yeni Üyelere Özel <strong>%10 İndirim</strong> Fırsatı Sizi Bekliyor — Organik büyüme fırsatını kaçırmayın!
      </div>
    </>
  )
}
