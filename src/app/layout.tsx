import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { SiteChrome } from '@/components/site-chrome'

const gilroy = Plus_Jakarta_Sans({
  variable: '--font-gilroy',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prmdia.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ProMedia — Instagram Takipçi Satın Al | Sosyal Medya Büyüme',
    template: '%s | ProMedia',
  },
  description:
    'Instagram, TikTok ve YouTube için takipçi, beğeni ve izlenme hizmetleri. Güvenli ödeme, hızlı teslimat, telafi garantisi.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${gilroy.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#F0F1F9]">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
