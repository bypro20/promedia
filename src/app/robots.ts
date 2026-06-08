import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  const base = `https://${SITE.domain}`
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/panel/', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
