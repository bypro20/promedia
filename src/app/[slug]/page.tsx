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
      <section className="border-b border-[#E9EBF5] bg-white py-8">
        <div className="sd-container">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EDE5FF] px-3 py-1 text-sm font-semibold text-[#7844E4]">
              {service.platform}
            </span>
            <span className="live-dot rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-xs font-semibold text-[#10B981]">
              Canlı teslimat
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-[#2C323E] sm:text-3xl">
            {service.title}
            <span className="mt-1 block text-base font-normal text-[#666F94]">
              — Hızlı Teslimat · Telafi Garantili
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#666F94]">
            Standart, Premium ve Gerçek VIP paketler. 100&apos;den 100K&apos;ya kadar. Şifre istemiyoruz, 3D Secure ödeme.
          </p>
        </div>
      </section>

      <section className="sd-container py-8">
        <ServiceOrderPanel service={service} />
      </section>

      <SeoBlocks platform={service.platform} unit={service.unit} />
      <Testimonials />
      <FaqSection items={service.faq} />
    </main>
  )
}
