'use client'

import { useEffect, useState } from 'react'
import { getPaytrIframeUrl } from '@/lib/paytr-client'

type Props = {
  token: string
  onSuccess: () => void
  onFailure: (reason?: string) => void
  onClose: () => void
}

export function PaytrFrame({ token, onSuccess, onFailure, onClose }: Props) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'paytr_success' || event.data?.status === 'success') {
        onSuccess()
      } else if (event.data?.type === 'paytr_fail' || event.data?.status === 'fail') {
        onFailure(event.data?.reason || 'Ödeme başarısız')
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSuccess, onFailure])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 py-4 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-[500px]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Güvenli Ödeme — PayTR</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </div>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white">
            <p className="text-sm text-[#666F94]">Ödeme sayfası yükleniyor…</p>
          </div>
        )}
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
          <iframe
            src={getPaytrIframeUrl(token)}
            className="w-full border-0"
            style={{ height: '600px' }}
            onLoad={() => setLoading(false)}
            title="PayTR Güvenli Ödeme"
            allow="payment"
          />
        </div>
        <p className="mt-3 text-center text-xs text-white/60">256-bit SSL · 3D Secure · Komisyon ödeme tutarına dahildir</p>
      </div>
    </div>
  )
}
