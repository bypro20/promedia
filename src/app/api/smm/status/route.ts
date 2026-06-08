import { NextResponse } from 'next/server'
import { fetchSmmBalance } from '@/lib/smm/client'
import { listProviderSummary } from '@/lib/smm/mapping'
import { clearServiceCache } from '@/lib/smm/mapping'
import { getConfiguredPanelIds, getSmmProviders, isAutoCheapestEnabled, isSmmConfigured, SMM_PANEL_PRESETS } from '@/lib/smm/providers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const refresh = searchParams.get('refresh') === '1'
  if (refresh) clearServiceCache()

  const configured = isSmmConfigured()
  const providers = getSmmProviders()

  const presets = SMM_PANEL_PRESETS.map((p) => ({
    id: p.id,
    name: p.name,
    site: p.apiUrl.replace('/api/v2', ''),
    apiUrl: p.apiUrl,
    envKey: p.envKey,
    minDeposit: p.minDeposit,
    note: p.note,
    configured: getConfiguredPanelIds().includes(p.id),
  }))

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      autoCheapest: isAutoCheapestEnabled(),
      message: 'En az bir panel API key tanımlayın (.env veya Vercel Environment Variables)',
      presets,
      howTo: [
        '1. Aşağıdaki sitelerden birine (veya birkaçına) kayıt olun',
        '2. Panel → API veya Hesap Ayarları → API Key kopyalayın',
        '3. Vercel → promedia → Settings → Environment Variables → ilgili SMM_KEY_* ekleyin',
        '4. Redeploy yapın — sistem otomatik en ucuz paneli seçer',
      ],
    })
  }

  try {
    const balances = await Promise.allSettled(
      providers.map(async (p) => {
        const balance = await fetchSmmBalance(p.id)
        return { id: p.id, name: p.name, balance }
      })
    )

    const summary = await listProviderSummary()

    return NextResponse.json({
      ok: true,
      configured: true,
      autoCheapest: isAutoCheapestEnabled(),
      providerCount: providers.length,
      providers: summary,
      balances: balances.map((b, i) =>
        b.status === 'fulfilled'
          ? { ...b.value, ok: true }
          : { id: providers[i].id, name: providers[i].name, ok: false, error: 'Bakiye alınamadı' }
      ),
      presets,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'SMM bağlantı hatası'
    return NextResponse.json({ ok: false, configured: true, error: message, presets }, { status: 500 })
  }
}
