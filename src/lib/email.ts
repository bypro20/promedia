import { SITE } from '@/lib/site-config'

type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? `${SITE.name} <noreply@${SITE.domain}>`

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[email]', payload.to, payload.subject)
    }
    return { ok: true, skipped: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: payload.to, subject: payload.subject, html: payload.html }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[email] failed', err)
    return { ok: false, error: err }
  }
  return { ok: true }
}

export function emailDepositApproved(to: string, amount: number, balance: number) {
  return sendEmail({
    to,
    subject: `${SITE.name} — Bakiye yükleme onaylandı`,
    html: `<p>${amount.toFixed(2)} ₺ bakiye yüklemeniz onaylandı.</p><p>Güncel bakiyeniz: <strong>${balance.toFixed(2)} ₺</strong></p>`,
  })
}

export function emailOrderCompleted(to: string, code: string, service: string) {
  return sendEmail({
    to,
    subject: `${SITE.name} — Sipariş tamamlandı (${code})`,
    html: `<p><strong>${code}</strong> numaralı siparişiniz tamamlandı.</p><p>Hizmet: ${service}</p>`,
  })
}

export function emailWelcome(to: string, name: string | null) {
  return sendEmail({
    to,
    subject: `${SITE.name} — Hoş geldiniz`,
    html: `<p>Merhaba ${name ?? ''},</p><p>${SITE.name} paneline kayıt oldunuz. Bakiye yükleyerek hemen sipariş verebilirsiniz.</p>`,
  })
}
