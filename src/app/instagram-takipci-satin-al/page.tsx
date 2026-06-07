import type { Metadata } from 'next'
import { ServiceOrderPanel } from '@/components/service-order-panel'
import { FaqSection } from '@/components/faq-section'

export const metadata: Metadata = {
  title: 'Instagram Takipçi Satın Al',
  description:
    'Instagram takipçi satın al — hızlı teslimat, güvenli ödeme, telafi garantisi. ProMedia ile hesabınızı büyütün.',
}

export default function InstagramFollowersPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">Instagram</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Instagram Takipçi Satın Al
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Paketinizi seçin, kullanıcı adınızı girin ve güvenle satın alın.
            Şifre paylaşmanıza gerek yok.
          </p>
        </div>

        <div className="mt-10">
          <ServiceOrderPanel />
        </div>
      </section>

      {/* Info blocks — clean, no stock photos */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {[
            {
              title: 'Hızlı teslimat',
              text: 'Siparişiniz onaylandıktan sonra kısa sürede teslimata başlanır. Büyük paketler kademeli tamamlanır.',
            },
            {
              title: 'Güvenli işlem',
              text: 'Ödemeler 3D Secure ile korunur. Yalnızca kullanıcı adınız yeterlidir, şifre asla istenmez.',
            },
            {
              title: 'Telafi garantisi',
              text: 'Garantili paketlerde düşüş yaşarsanız telafi talebi oluşturabilirsiniz.',
            },
          ].map((block) => (
            <div key={block.title}>
              <h2 className="font-medium">{block.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection />
    </main>
  )
}
