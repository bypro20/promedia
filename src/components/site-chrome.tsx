'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hide = pathname.startsWith('/panel') || pathname.startsWith('/admin')

  if (hide) return <>{children}</>

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
