import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const gilroy = Plus_Jakarta_Sans({
  variable: '--font-gilroy',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
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
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
