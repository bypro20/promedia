import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function LegalPage({ title, subtitle, children }: Props) {
  return (
    <main className="py-12">
      <div className="sd-container max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[#7844E4] hover:underline">
          ← Ana Sayfa
        </Link>
        <h1 className="mt-4 text-3xl font-black text-[#33353E]">{title}</h1>
        {subtitle && <p className="mt-2 text-[#666F94]">{subtitle}</p>}
        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-[#33353E]">{children}</div>
        <p className="mt-10 text-xs text-[#666F94]">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </main>
  )
}
