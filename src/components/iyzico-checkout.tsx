'use client'

import { useEffect, useRef } from 'react'
import { PaymentTrustBar } from '@/components/payment-trust-bar'

type Props = {
  checkoutFormContent: string
  gross: number
  packageLabel: string
  onClose: () => void
}

export function IyzicoCheckout({ checkoutFormContent, gross, packageLabel, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = checkoutFormContent
    const scripts = container.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const script = document.createElement('script')
      for (const attr of oldScript.attributes) {
        script.setAttribute(attr.name, attr.value)
      }
      script.textContent = oldScript.textContent
      oldScript.replaceWith(script)
    })
  }, [checkoutFormContent])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 py-4 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-[520px]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Güvenli Ödeme — iyzico</h3>
            <p className="text-sm text-white/70">
              {packageLabel} — {gross.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>
        <div
          ref={containerRef}
          className="min-h-[480px] overflow-hidden rounded-xl bg-white shadow-2xl"
        />
        <div className="mt-4">
          <PaymentTrustBar variant="dark" showLinks={false} />
        </div>
      </div>
    </div>
  )
}
