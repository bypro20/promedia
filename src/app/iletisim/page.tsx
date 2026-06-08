import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal/legal-page'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'ProMedia destek ekibi ile iletişime geçin.',
}

export default function IletisimPage() {
  return (
    <LegalPage title="İletişim" subtitle={SITE.workingHours}>
      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">E-posta</p>
          <a href={`mailto:${SITE.email}`} className="mt-1 block font-bold text-[#7844E4] hover:underline">
            {SITE.email}
          </a>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">WhatsApp</p>
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block font-bold text-[#7844E4] hover:underline">
            {SITE.phone}
          </a>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Sipariş Sorgula</p>
          <Link href="/siparis-sorgula" className="mt-1 block font-bold text-[#7844E4] hover:underline">
            Sipariş kodunuz ile durum takibi →
          </Link>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Panel Destek</p>
          <Link href="/panel/destek" className="mt-1 block font-bold text-[#7844E4] hover:underline">
            Giriş yapıp destek talebi açın →
          </Link>
        </div>
      </div>
      <p className="mt-6">
        Sipariş, bakiye ve telafi konularında önce panelinizden destek talebi açmanız yanıt süresini kısaltır.
        Acil durumlar için WhatsApp hattımızı kullanabilirsiniz.
      </p>
    </LegalPage>
  )
}
