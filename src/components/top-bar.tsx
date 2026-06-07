import Link from 'next/link'

export function TopBar() {
  return (
    <div className="bg-purple-dark text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:text-sm sm:px-6">
        <span className="flex items-center gap-2">
          <span className="live-dot h-2 w-2 rounded-full bg-green-400" />
          Yeni üyelere <strong className="text-pink-300">%10 indirim</strong> · 7/24 Canlı Destek
        </span>
        <div className="flex gap-4">
          <Link href="/telafi-talebi" className="hover:text-pink-300">Telafi Talebi</Link>
          <Link href="/siparis-sorgula" className="hover:text-pink-300">Sipariş Sorgula</Link>
        </div>
      </div>
    </div>
  )
}
