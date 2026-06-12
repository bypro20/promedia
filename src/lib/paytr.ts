import crypto from 'crypto'
import { SITE } from '@/lib/site-config'

const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || ''
const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''
const TEST_MODE = process.env.PAYTR_TEST_MODE === '1' ? '1' : '0'
const PAYTR_API_BASE = 'https://www.paytr.com'

function generatePaytrToken(hashString: string): string {
  return crypto.createHmac('sha256', MERCHANT_KEY).update(hashString + MERCHANT_SALT).digest('base64')
}

export function isPaytrConfigured() {
  return !!(MERCHANT_ID && MERCHANT_KEY && MERCHANT_SALT)
}

export function siteBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE.domain}`).replace(/\/$/, '')
}

export type CreatePaymentTokenParams = {
  merchantOid: string
  userEmail: string
  userName: string
  userPhone?: string
  userIp: string
  /** Müşterinin karttan ödeyeceği tutar (komisyon dahil) */
  paymentAmountGross: number
  basketLabel: string
  okUrl: string
  failUrl: string
}

export async function createPaymentToken(params: CreatePaymentTokenParams) {
  const paymentAmountCents = Math.round(params.paymentAmountGross * 100)
  const paymentType = 'card'
  const nonThreeD = '0'
  const currency = 'TL'
  const installmentCount = 0

  const hashString = [
    MERCHANT_ID,
    params.userIp,
    params.merchantOid,
    params.userEmail,
    paymentAmountCents,
    paymentType,
    installmentCount,
    currency,
    TEST_MODE,
    nonThreeD,
  ].join('')

  const paytrToken = generatePaytrToken(hashString)

  const body = new URLSearchParams({
    merchant_id: MERCHANT_ID,
    user_ip: params.userIp,
    merchant_oid: params.merchantOid,
    email: params.userEmail,
    payment_amount: paymentAmountCents.toString(),
    paytr_token: paytrToken,
    user_name: params.userName,
    user_phone: params.userPhone || '05555555555',
    payment_type: paymentType,
    installment_count: installmentCount.toString(),
    currency,
    test_mode: TEST_MODE,
    debug_on: process.env.NODE_ENV === 'development' ? '1' : '0',
    non_3d: nonThreeD,
    merchant_ok_url: params.okUrl,
    merchant_fail_url: params.failUrl,
    timeout_limit: '30',
    store_card: '0',
    user_basket: JSON.stringify([[params.basketLabel, paymentAmountCents.toString(), 1]]),
  })

  const response = await fetch(`${PAYTR_API_BASE}/odeme/api/get-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = (await response.json()) as { status?: string; token?: string; reason?: string; fail_reason?: string }
  if (data.status === 'success' && data.token) {
    return { ok: true as const, token: data.token }
  }
  return { ok: false as const, error: data.reason || data.fail_reason || 'PayTR token alınamadı' }
}

export type PaytrCallbackData = {
  merchantOid: string
  status: 'success' | 'failed'
  totalAmount: number
  failedReasonMsg?: string
}

export function parseCallback(body: Record<string, string>): PaytrCallbackData | null {
  const hashString = body.merchant_oid + MERCHANT_SALT + body.status + body.total_amount
  const expectedHash = crypto.createHmac('sha256', MERCHANT_KEY).update(hashString).digest('base64')
  if (expectedHash !== body.hash) return null

  return {
    merchantOid: body.merchant_oid,
    status: body.status === 'success' ? 'success' : 'failed',
    totalAmount: parseInt(body.total_amount, 10),
    failedReasonMsg: body.failed_reason_msg || undefined,
  }
}

export function generateDepositMerchantOid(userId: string) {
  const ts = Date.now()
  const rand = crypto.randomBytes(3).toString('hex')
  return `pm_dep_${userId.slice(-8)}_${ts}_${rand}`
}

export function getPaytrIframeUrl(token: string) {
  return `https://www.paytr.com/odeme/guvenli/${token}`
}
