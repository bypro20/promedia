import { NextResponse } from 'next/server'
import { authenticateApiKey, rateLimit } from '@/lib/api-v1-auth'

export async function GET(req: Request) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 })
  }
  if (!rateLimit(`v1:${user.id}`, 120)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  const fresh = await authenticateApiKey(req.headers.get('authorization'))
  return NextResponse.json({ ok: true, balance: fresh?.balance ?? user.balance, currency: 'TRY' })
}
