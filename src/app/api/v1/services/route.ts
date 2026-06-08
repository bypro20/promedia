import { NextResponse } from 'next/server'
import { authenticateApiKey, rateLimit } from '@/lib/api-v1-auth'
import { ALL_SERVICES } from '@/lib/catalog'

export async function GET(req: Request) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 })
  }
  if (!rateLimit(`v1:${user.id}`, 120)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  const services = ALL_SERVICES.map((s) => ({
    slug: s.slug,
    title: s.title,
    platform: s.platform,
    unit: s.unit,
    tiers: s.tiers.map((t) => ({
      id: t.id,
      packages: t.packages.map((p) => ({ id: p.id, amount: p.amount, price: p.price })),
    })),
  }))

  return NextResponse.json({ ok: true, services })
}
