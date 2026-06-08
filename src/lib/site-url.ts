/** İstek veya env'den canonical site kök URL */
export function getSiteOrigin(req?: Request): string {
  if (req) {
    const url = new URL(req.url)
    return url.origin
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

export function absoluteUrl(path: string, req?: Request): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, getSiteOrigin(req)).toString()
}
