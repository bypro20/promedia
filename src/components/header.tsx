import Link from 'next/link'
import { SERVICES } from '@/lib/packages'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Pro<span className="text-accent">Media</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="group relative">
            <button
              type="button"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Hizmetler
            </button>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="min-w-[220px] rounded-xl border border-border bg-card p-2 shadow-lg">
                {SERVICES.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent-soft"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/siparis-sorgula" className="text-sm text-muted transition-colors hover:text-foreground">
            Sipariş Sorgula
          </Link>
          <Link href="/telafi-talebi" className="text-sm text-muted transition-colors hover:text-foreground">
            Telafi Talebi
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/instagram-takipci-satin-al"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Sipariş Ver
          </Link>
        </div>
      </div>
    </header>
  )
}
