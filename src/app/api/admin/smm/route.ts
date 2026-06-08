import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { ensureSmmKeyCache, listSavedSmmKeys, refreshSmmKeyCache, saveSmmKey } from '@/lib/smm/key-store'
import { clearServiceCache } from '@/lib/smm/mapping'
import { SMM_PANEL_PRESETS } from '@/lib/smm/providers'

export async function GET() {
  try {
    await requireAdmin()
    await ensureSmmKeyCache()
    const saved = await listSavedSmmKeys()
    return NextResponse.json({
      ok: true,
      presets: SMM_PANEL_PRESETS.map((p) => ({
        id: p.id,
        name: p.name,
        envKey: p.envKey,
        site: p.apiUrl.replace('/api/v2', ''),
        savedInDb: saved[p.envKey] ?? false,
        fromEnv: Boolean(process.env[p.envKey]),
      })),
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

const saveSchema = z.object({
  envKey: z.string().min(1),
  apiKey: z.string(),
})

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = saveSchema.parse(await req.json())
    const preset = SMM_PANEL_PRESETS.find((p) => p.envKey === body.envKey)
    if (!preset) {
      return NextResponse.json({ ok: false, error: 'Geçersiz panel' }, { status: 400 })
    }

    await saveSmmKey(body.envKey, body.apiKey)
    clearServiceCache()
    await refreshSmmKeyCache()

    return NextResponse.json({ ok: true, message: body.apiKey ? 'API key kaydedildi' : 'API key silindi' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz veri' }, { status: 400 })
    }
    return NextResponse.json({ ok: false, error: 'Kayıt başarısız' }, { status: 500 })
  }
}
