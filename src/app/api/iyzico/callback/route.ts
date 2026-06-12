import { NextRequest, NextResponse } from 'next/server'
import { processIyzicoCallbackToken } from '@/lib/iyzico-process-payment'
import { siteBaseUrl } from '@/lib/paytr'

function redirectUrl(
  status: 'success' | 'failed',
  kind: 'order' | 'deposit',
  code?: string
) {
  const base = siteBaseUrl()
  if (kind === 'deposit') {
    const url = new URL('/panel/bakiye', base)
    url.searchParams.set('payment', status === 'success' ? 'success' : 'failed')
    return NextResponse.redirect(url)
  }
  const path = status === 'success' ? '/odeme/basarili' : '/odeme/basarisiz'
  const url = new URL(path, base)
  if (code) url.searchParams.set('code', code)
  return NextResponse.redirect(url)
}

async function handleToken(token: string | null) {
  if (!token) return redirectUrl('failed', 'order')

  try {
    const result = await processIyzicoCallbackToken(token)
    if (!result.ok) {
      console.error('[iyzico callback]', result.error)
      return redirectUrl('failed', 'order')
    }
    return redirectUrl(result.redirect, result.kind, result.orderCode)
  } catch (error) {
    console.error('[iyzico callback]', error)
    return redirectUrl('failed', 'order')
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const token = formData.get('token')?.toString() || null
  return handleToken(token)
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  return handleToken(token)
}
