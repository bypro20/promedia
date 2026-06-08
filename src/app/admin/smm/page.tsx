'use client'

import { useEffect, useState } from 'react'

export default function AdminSmmPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    void fetch('/api/smm/status?refresh=1').then((r) => r.json()).then(setData)
  }, [])

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">SMM Paneller</h1>
      <p className="mt-2 text-sm text-[#666F94]">Otomatik en ucuz panel seçimi aktif</p>
      <pre className="mt-6 overflow-auto rounded-2xl bg-[#282D40] p-4 text-xs text-green-400">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="mt-6 rounded-2xl bg-white p-5 text-sm shadow-sm">
        <h2 className="font-bold">Kurulum</h2>
        <p className="mt-2 text-[#666F94]">Vercel Environment Variables:</p>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          <li>SMM_KEY_MEDYABAYIM</li>
          <li>SMM_KEY_PEAKERR</li>
          <li>SMM_AUTO_CHEAPEST=true</li>
        </ul>
      </div>
    </main>
  )
}
