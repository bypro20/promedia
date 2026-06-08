import { NextResponse } from 'next/server'
import { syncPendingOrders } from '@/lib/smm/order-service'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const result = await syncPendingOrders(100)
  return NextResponse.json({ ok: true, ...result })
}
