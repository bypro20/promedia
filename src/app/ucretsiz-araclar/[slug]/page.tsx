import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FreeToolWidget } from '@/components/tools/free-tools'
import { FREE_TOOLS, getAllToolSlugs, getFreeTool } from '@/lib/free-tools'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getFreeTool(slug)
  if (!tool) return { title: 'Araç bulunamadı' }
  return {
    title: tool.title,
    description: tool.description,
  }
}

export default async function FreeToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getFreeTool(slug)
  if (!tool) notFound()

  const others = FREE_TOOLS.filter((t) => t.slug !== slug).slice(0, 4)

  return (
    <main className="py-12">
      <div className="sd-container max-w-3xl">
        <Link href="/ucretsiz-araclar" className="text-sm font-semibold text-[#7844E4] hover:underline">
          ← Ücretsiz Araçlar
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white"
            style={{ backgroundColor: tool.color }}
          >
            {tool.icon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#666F94]">{tool.platform}</p>
            <h1 className="text-2xl font-black text-[#33353E] sm:text-3xl">{tool.title}</h1>
          </div>
        </div>
        <p className="mt-3 text-[#666F94]">{tool.description}</p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <FreeToolWidget slug={slug} />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-[#33353E]">Diğer araçlar</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((t) => (
              <Link
                key={t.slug}
                href={`/ucretsiz-araclar/${t.slug}`}
                className="rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm font-semibold text-[#33353E] hover:border-[#7844E4] hover:text-[#7844E4]"
              >
                {t.title} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
