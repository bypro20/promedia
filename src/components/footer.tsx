import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">
              Pro<span className="text-accent">Media</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sosyal medya büyüme hizmetleri. Güvenli ödeme, hızlı teslimat, 7/24 destek.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Hizmetler</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/instagram-takipci-satin-al" className="hover:text-foreground">Instagram Takipçi</Link></li>
              <li><Link href="#" className="hover:text-foreground">Instagram Beğeni</Link></li>
              <li><Link href="#" className="hover:text-foreground">TikTok Takipçi</Link></li>
              <li><Link href="#" className="hover:text-foreground">YouTube Abone</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Destek</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/siparis-sorgula" className="hover:text-foreground">Sipariş Sorgula</Link></li>
              <li><Link href="/telafi-talebi" className="hover:text-foreground">Telafi Talebi</Link></li>
              <li><Link href="#" className="hover:text-foreground">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Kurumsal</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="#" className="hover:text-foreground">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="hover:text-foreground">İade Koşulları</Link></li>
              <li><Link href="#" className="hover:text-foreground">KVKK</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} ProMedia. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
