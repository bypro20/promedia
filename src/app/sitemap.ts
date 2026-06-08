import type { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/blog-posts'
import { getAllSlugs } from '@/lib/catalog'
import { getAllToolSlugs } from '@/lib/free-tools'
import { SITE } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE.domain}`
  const now = new Date()

  const staticPages = [
    '', '/hizmetler', '/blog', '/ucretsiz-araclar', '/giris', '/kayit',
    '/siparis-sorgula', '/telafi-talebi', '/sepet', '/hakkimizda', '/iletisim',
    '/kvkk', '/iade-kosullari', '/kullanim-sozlesmesi',
  ]

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
    ...getAllSlugs().map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...getAllBlogSlugs().map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...getAllToolSlugs().map((slug) => ({
      url: `${base}/ucretsiz-araclar/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
