import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { formatOrderForClient, getOrderForUser, lookupOrder } from '@/lib/smm/order-service'

type Props = { params: Promise<{ code: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const user = await requireCustomerSession()
    const { code } = await params
    const order = await getOrderForUser(code, user.id)
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Sipariş bulunamadı' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, order: formatOrderForClient(order) })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(_req: Request, { params }: Props) {
  try {
    const user = await requireCustomerSession()
    const { code } = await params
    const order = await getOrderForUser(code, user.id)
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Sipariş bulunamadı' }, { status: 404 })
    }
    const fresh = await lookupOrder(order.code)
    return NextResponse.json({ ok: true, order: formatOrderForClient(fresh) })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
