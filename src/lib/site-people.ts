import { PEOPLE } from './people-images'

/** Müşteri yorumları — site kullanıcıları (yönetim kadrosundan farklı isimler) */
export const REVIEWERS = [
  {
    id: 'murat',
    name: 'Murat Güneş',
    role: 'Dijital Pazarlama',
    photo: PEOPLE.ahmet,
    count: '1.280',
    followers: '126.492',
    text: 'İşletmemin Instagram hesabını büyütmek için takipçi satın aldım ve gerçekten memnun kaldım. Gelen takipçiler organik görünüyor ve etkileşim oranım arttı.',
  },
  {
    id: 'deniz',
    name: 'Deniz Koç',
    role: 'Influencer',
    photo: PEOPLE.zeynep,
    count: '890',
    followers: '48.200',
    text: 'Premium paket ile keşfete düştüm. Hızlı teslimat ve telafi garantisi gerçekten işe yarıyor.',
  },
  {
    id: 'seda',
    name: 'Seda Polat',
    role: 'E-ticaret',
    photo: PEOPLE.elif,
    count: '2.100',
    followers: '31.750',
    text: 'Türk takipçi paketi yerel etkileşimimi ciddi artırdı. Destek ekibi anında yardımcı oldu.',
  },
  {
    id: 'caner',
    name: 'Caner Bulut',
    role: 'Kişisel Hesap',
    photo: PEOPLE.emre,
    count: '560',
    followers: '18.400',
    text: 'TikTok ve Instagram paketlerini birlikte kullandım. Sorunsuz teslimat, tavsiye ederim.',
  },
  {
    id: 'burcu',
    name: 'Burcu Tekin',
    role: 'Marka Hesabı',
    photo: PEOPLE.ahsen,
    count: '3.400',
    followers: '92.600',
    text: 'ProMedia ile 6 aydır çalışıyorum. Kalıcı VIP paket minimum düşüş sağlıyor.',
  },
] as const

export type Reviewer = (typeof REVIEWERS)[number]
