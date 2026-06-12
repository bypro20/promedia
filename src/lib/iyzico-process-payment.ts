import { grossFromNet } from '@/lib/iyzico-commission'
import { retrieveCheckoutForm } from '@/lib/iyzico'
import {
  completeGuestOrderPayment,
  failGuestOrderPayment,
} from '@/lib/smm/order-service'
import {
  completeIyzicoDeposit,
  failIyzicoDeposit,
} from '@/lib/deposits'

export type PaymentProcessResult =
  | { ok: true; redirect: 'success' | 'failed'; orderCode?: string; kind: 'order' | 'deposit' }
  | { ok: false; error: string }

function isDepositRef(ref: string) {
  return ref.toLowerCase().startsWith('pm_dep_')
}

async function processDepositPayment(
  paymentRef: string,
  paidKurus: number,
  paymentStatus: string | undefined
): Promise<PaymentProcessResult> {
  if (paymentStatus !== 'SUCCESS') {
    await failIyzicoDeposit(paymentRef)
    return { ok: true, redirect: 'failed', orderCode: paymentRef, kind: 'deposit' }
  }

  try {
    await completeIyzicoDeposit(paymentRef, paidKurus)
    return { ok: true, redirect: 'success', orderCode: paymentRef, kind: 'deposit' }
  } catch (err) {
    console.error('[iyzico] deposit error:', err)
    await failIyzicoDeposit(paymentRef, err instanceof Error ? err.message : undefined)
    return { ok: true, redirect: 'failed', orderCode: paymentRef, kind: 'deposit' }
  }
}

export async function processIyzicoCallbackToken(
  token: string
): Promise<PaymentProcessResult> {
  const result = await retrieveCheckoutForm(token)

  if (result.status !== 'success') {
    console.error('[iyzico] retrieve failed:', result)
    return { ok: true, redirect: 'failed', kind: 'order' }
  }

  const ref = (result.basketId || result.conversationId || '').trim()
  const paidKurus = Math.round(parseFloat(result.paidPrice || '0') * 100)

  if (isDepositRef(ref)) {
    return processDepositPayment(ref, paidKurus, result.paymentStatus)
  }

  const orderCode = ref.toUpperCase()
  if (!orderCode) {
    return { ok: false, error: 'Sipariş kimliği bulunamadı' }
  }

  if (result.paymentStatus !== 'SUCCESS') {
    await failGuestOrderPayment(orderCode)
    return { ok: true, redirect: 'failed', orderCode, kind: 'order' }
  }

  const { prisma } = await import('@/lib/db')
  const order = await prisma.order.findUnique({ where: { code: orderCode } })
  if (!order) {
    return { ok: false, error: 'Sipariş bulunamadı' }
  }

  const expectedGross = grossFromNet(order.price).gross
  const expectedKurus = Math.round(expectedGross * 100)
  if (expectedKurus > 0 && paidKurus !== expectedKurus) {
    console.error(
      `[iyzico] Amount mismatch for ${orderCode}: expected ${expectedKurus}, got ${paidKurus}`
    )
    await failGuestOrderPayment(orderCode)
    return { ok: true, redirect: 'failed', orderCode, kind: 'order' }
  }

  try {
    await completeGuestOrderPayment(orderCode)
    return { ok: true, redirect: 'success', orderCode, kind: 'order' }
  } catch (err) {
    console.error('[iyzico] fulfill error:', err)
    return { ok: true, redirect: 'success', orderCode, kind: 'order' }
  }
}
