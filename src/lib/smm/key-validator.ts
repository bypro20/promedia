/** SMM panel API key format + canlı bağlantı testi */

import { assertSmmApiOk, readSmmApiJson } from './api-response'

export type KeyFormatResult = { ok: true } | { ok: false; reason: string }

export type KeyTestResult = {
  ok: boolean
  balance?: string
  currency?: string
  serviceCount?: number
  error?: string
}

/** Yıldızlı maske, boş veya yanlış endpoint cevabı gibi bariz hataları yakala */
export function validateKeyFormat(apiKey: string): KeyFormatResult {
  const key = apiKey.trim()

  if (!key) {
    return { ok: false, reason: 'API key boş olamaz' }
  }

  if (key.includes('*')) {
    return {
      ok: false,
      reason: 'Yıldızlı (****) metin gerçek key değil — panelden yeni key oluşturup oluşturulur oluşturulmaz kopyalayın',
    }
  }

  if (key.length > 80) {
    return {
      ok: false,
      reason: 'Key çok uzun — bu muhtemelen /newkey sayfasının HTML cevabı, gerçek API key değil',
    }
  }

  if (/^[A-Za-z0-9+/=]{60,}$/.test(key)) {
    return {
      ok: false,
      reason: 'Base64 benzeri uzun metin geçerli API key değil — panel hesabınızdan 32 karakterlik hex key alın',
    }
  }

  if (key.length < 16) {
    return { ok: false, reason: 'Key çok kısa — geçerli bir SMM API key yapıştırın' }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    return { ok: false, reason: 'Key geçersiz karakter içeriyor — boşluk veya özel karakter olmamalı' }
  }

  return { ok: true }
}

/** Kaydetmeden önce panel API'sine balance + services isteği at */
export async function testSmmKey(apiUrl: string, apiKey: string): Promise<KeyTestResult> {
  const format = validateKeyFormat(apiKey)
  if (!format.ok) return { ok: false, error: format.reason }

  try {
    const balanceBody = new URLSearchParams({ key: apiKey.trim(), action: 'balance' })
    const balanceRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: balanceBody,
      cache: 'no-store',
    })

    const balanceData = (await readSmmApiJson(balanceRes)) as {
      balance?: string
      currency?: string
      error?: string
    } | null

    try {
      assertSmmApiOk(balanceRes, balanceData)
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Bağlantı testi başarısız' }
    }

    if (!balanceData || typeof balanceData !== 'object' || Array.isArray(balanceData)) {
      return { ok: false, error: 'Panel geçersiz yanıt döndü' }
    }

    let serviceCount: number | undefined
    try {
      const svcBody = new URLSearchParams({ key: apiKey.trim(), action: 'services' })
      const svcRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: svcBody,
        cache: 'no-store',
      })
      if (svcRes.ok) {
        const svcData = await svcRes.json()
        if (Array.isArray(svcData)) serviceCount = svcData.length
      }
    } catch {
      /* services optional */
    }

    return {
      ok: true,
      balance: balanceData.balance,
      currency: balanceData.currency,
      serviceCount,
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Bağlantı testi başarısız' }
  }
}
