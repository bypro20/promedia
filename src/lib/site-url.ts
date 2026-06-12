/** İstek veya env'den canonical site kök URL */
export function getSiteOrigin(req?: Request): string {
  if (req) {
    const url = new URL(req.url)
    const host = req.headers.get('x-forwarded-host') ?? url.host
    const proto = req.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
    if (host && !host.includes('.vercel.app')) {
      return `${proto}://${host.split(',')[0].trim()}`
    }
    return url.origin
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
  )
}

export function absoluteUrl(path: string, req?: Request): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, getSiteOrigin(req)).toString()
}
