import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getService, getAllSlugs } from '@/lib/catalog'
import { ServiceOrderPanel } from '@/components/service-order-panel'
import { FaqSection } from '@/components/faq-section'
import { Testimonials } from '@/components/testimonials'
import { SeoBlocks } from '@/components/seo-blocks'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: 'Bulunamadı' }
  return {
    title: `${service.title} — Hızlı Teslimat | ProMedia`,
    description: `${service.title}. Standart, Premium ve Gerçek VIP paketler. 100–100K arası, telafi garantili, 3D Secure ödeme.`,
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <main>
      {/* Hero — SosyalDigital tarzı */}
      <section className={`bg-gradient-to-br ${service.heroGradient} px-4 py-10 text-white sm:px-6 sm:py-12`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              {service.platformIcon} {service.platform}
            </span>
            <span className="live-dot rounded-full bg-green-400 px-2.5 py-0.5 text-xs font-bold text-green-950">
              Canlı teslimat
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {service.title}
            <span className="mt-1 block text-lg font-normal opacity-90 sm:text-xl">
              — Hızlı Teslimat · Telafi Garantili
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Standart, Premium ve Gerçek VIP paketler. 100&apos;den 100K&apos;ya kadar.
            Şifre istemiyoruz, 3D Secure ödeme.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <ServiceOrderPanel service={service} />
      </section>

      <SeoBlocks platform={service.platform} unit={service.unit} />
      <Testimonials />
      <FaqSection items={service.faq} />
    </main>
  )
}
