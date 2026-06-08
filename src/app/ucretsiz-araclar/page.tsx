import type { Metadata } from 'next'
import Link from 'next/link'
import { FREE_TOOLS } from '@/lib/free-tools'

export const metadata: Metadata = {
  title: 'Ücretsiz Araçlar',
  description: 'Hashtag oluşturucu, bio aracı, karakter sayacı ve büyüme hesaplayıcı — ProMedia ücretsiz SMM araçları.',
}

export default function UcretsizAraclarPage() {
  return (
    <main className="py-12">
      <div className="sd-container">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#33353E]">Ücretsiz Araçlar</h1>
          <p className="mt-2 max-w-2xl mx-auto text-[#666F94]">
            Sosyal medya büyümenize yardımcı olacak ücretsiz araçlarımız. Kayıt gerekmez — hemen kullanın.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/ucretsiz-araclar/${tool.slug}`}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(120,68,228,0.15)]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white"
                style={{ backgroundColor: tool.color }}
              >
                {tool.icon}
              </span>
              <h2 className="mt-4 text-lg font-bold text-[#33353E] group-hover:text-[#7844E4]">{tool.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#666F94]">{tool.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#7844E4]">{tool.platform}</p>
              <span className="mt-3 text-sm font-bold text-[#7844E4]">Aracı Aç →</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#282D40] p-8 text-center text-white">
          <p className="text-xl font-bold">Gerçek sipariş vermek ister misiniz?</p>
          <p className="mt-2 text-sm text-white/70">
            Panelimize kayıt olun — Instagram, TikTok ve YouTube için binlerce hizmet.
          </p>
          <Link
            href="/kayit"
            className="mt-4 inline-block rounded-xl bg-[#7844E4] px-6 py-3 text-sm font-bold hover:bg-[#6835d3]"
          >
            Ücretsiz Hesap Oluştur
          </Link>
        </div>
      </div>
    </main>
  )
}
