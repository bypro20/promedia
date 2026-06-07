import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'ProMedia — Sosyal Medya Büyüme Hizmetleri',
    template: '%s | ProMedia',
  },
  description:
    'Instagram, TikTok ve YouTube için takipçi, beğeni ve izlenme hizmetleri. Güvenli ödeme, hızlı teslimat.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
