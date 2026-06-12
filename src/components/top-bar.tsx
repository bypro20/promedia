import Link from 'next/link'
import { IconPhone } from './icons'

/** SD: .top-bar-section — #7844E4, 42px, sticky, 14px font */
export function TopBar() {
  return (
    <section className="sticky top-0 z-[1000] bg-[#7844E4] text-white">
      <div className="sd-container flex h-[42px] items-center justify-between text-sm">
        <Link href="/iletisim" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
          <IconPhone size={14} />
          İletişim
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/telafi-talebi" className="transition-opacity hover:opacity-80">
            Telafi Talebi
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/siparis-sorgula" className="transition-opacity hover:opacity-80">
            Sipariş Sorgula
          </Link>
        </div>
      </div>
    </section>
  )
}
