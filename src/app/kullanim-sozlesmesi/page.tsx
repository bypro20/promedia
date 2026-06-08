import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Kullanım Sözleşmesi',
  description: 'ProMedia panel kullanım şartları ve sözleşmesi.',
}

export default function SozlesmePage() {
  return (
    <LegalPage title="Kullanım Sözleşmesi" subtitle="Panel kullanım şartları">
      <p>
        {SITE.name} paneline kayıt olarak ve hizmet satın alarak bu sözleşmeyi kabul etmiş sayılırsınız.
      </p>
      <h2 className="text-xl font-bold">Hizmet Kapsamı</h2>
      <p>
        Panel, sosyal medya etkileşim hizmetlerinin sipariş edilmesi için ara yüz sağlar. Teslimat süreleri
        servis türüne ve SMM sağlayıcısına göre değişir.
      </p>
      <h2 className="text-xl font-bold">Kullanıcı Yükümlülükleri</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Doğru ve herkese açık profil/gönderi linki sağlamak</li>
        <li>Hesap şifresini panel ile paylaşmamak (panel asla şifre istemez)</li>
        <li>Yasadışı içerik veya spam amaçlı kullanımdan kaçınmak</li>
        <li>Bakiye yüklemelerinde doğru referans numarası kullanmak</li>
      </ul>
      <h2 className="text-xl font-bold">Hesap Güvenliği</h2>
      <p>
        Hesabınızın güvenliğinden siz sorumlusunuz. Şüpheli aktivite durumunda derhal {SITE.email} adresine bildirin.
      </p>
      <h2 className="text-xl font-bold">Fikri Mülkiyet</h2>
      <p>
        Panel tasarımı, yazılımı ve markası {SITE.name}&apos;a aittir. İzinsiz kopyalama yasaktır.
      </p>
    </LegalPage>
  )
}
