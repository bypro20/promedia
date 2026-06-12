import { NextResponse } from 'next/server'
import { completePaytrDeposit, failPaytrDeposit } from '@/lib/deposits'
import { fulfillOrdersAwaitingPanelBalance } from '@/lib/smm/order-service'
import { parseCallback } from '@/lib/paytr'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    const data = parseCallback(body)
    if (!data) {
      return new NextResponse('INVALID', { status: 400 })
    }

    if (!data.merchantOid.startsWith('pm_dep_')) {
      return new NextResponse('INVALID', { status: 400 })
    }

    if (data.status === 'success') {
      try {
        await completePaytrDeposit(data.merchantOid, data.totalAmount)
        void fulfillOrdersAwaitingPanelBalance(50).catch(() => {})
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown'
        if (msg.includes('zaten') || msg.includes('approved')) {
          return new NextResponse('OK', { status: 200 })
        }
        console.error('[PayTR]', msg)
        return new NextResponse('INVALID', { status: 400 })
      }
    } else {
      await failPaytrDeposit(data.merchantOid, data.failedReasonMsg)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[PayTR Callback]', err)
    return new NextResponse('ERROR', { status: 500 })
  }
}
