import { getService } from '@/lib/catalog'
import { ServiceOrderPanel } from '@/components/service-order-panel'
import { FaqSection } from '@/components/faq-section'
import { Testimonials } from '@/components/testimonials'
import { SeoBlocks } from '@/components/seo-blocks'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs } from '@/lib/catalog'
import { getAudienceBadgeColor } from '@/lib/catalog'

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
    description: `${service.title}. Ucuz Global, Standart, Premium ve Gerçek VIP paketler. Telafi garantili, 3D Secure ödeme.`,
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const audienceColor = getAudienceBadgeColor(service.audience)

  return (
    <main>
      <section
        className="border-b py-8 text-white"
        style={{ background: `linear-gradient(135deg, ${service.platformColor} 0%, ${service.platformColor}dd 100%)` }}
      >
        <div className="sd-container">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur-sm">
              {service.platformIcon} {service.platform}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-black uppercase text-white"
              style={{ backgroundColor: audienceColor }}
            >
              {service.audience === 'ucuz' ? 'Ucuz Global' : service.audience === 'turk' ? 'Türk Paket' : 'Global Paket'}
            </span>
            <span className="live-dot rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold">
              Canlı teslimat
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
            {service.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-white/90">
            Ucuz Global · Global Standart · Premium · Gerçek VIP — 100&apos;den 100K&apos;ya.
            Şifre istemiyoruz, 3D Secure ödeme, telafi garantili.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Ucuz Global', 'Global Standart', 'Premium', 'Gerçek VIP'].map((t) => (
              <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="sd-container py-8">
        <ServiceOrderPanel service={service} />
      </section>

      <SeoBlocks platform={service.platform} unit={service.unit} platformColor={service.platformColor} />
      <Testimonials />
      <FaqSection items={service.faq} />
    </main>
  )
}
