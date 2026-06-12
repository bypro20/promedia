'use client'

import { useState } from 'react'
import Image from 'next/image'
import { REVIEWERS } from '@/lib/site-people'
import { FadeIn } from '@/components/ui/fade-in'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const r = REVIEWERS[active]

  return (
    <section className="overflow-hidden bg-white py-14">
      <div className="sd-container">
        <FadeIn>
          <h2 className="text-center text-2xl font-black text-[#33353E] lg:text-3xl">
            Markamıza Güvenen <span className="text-[#7844E4]">Müşteri Yorumları</span>
          </h2>
          <p className="mt-1 text-center text-sm text-[#666F94]">Söz bizde değil, bizi tercih edenlerde!</p>
        </FadeIn>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          <FadeIn direction="right" delay={80}>
            <div className="sd-scroll-track sd-scroll-track--responsive lg:mx-0 lg:px-0">
              <div className="sd-scroll-row flex flex-row lg:flex-col lg:overflow-visible">
                {REVIEWERS.map((rev, i) => (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                      active === i
                        ? 'border-[#7844E4] bg-[#EDE5FF] shadow-md shadow-[#7844E4]/10'
                        : 'border-[#E9EBF5] bg-white hover:border-[#7844E4]/50'
                    }`}
                  >
                    <Image
                      src={rev.photo}
                      alt={rev.name}
                      width={44}
                      height={44}
                      className="sd-person-ring h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#33353E]">{rev.name}</p>
                      <p className="text-xs text-[#666F94]">{rev.followers} takipçi · {rev.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={160}>
            <div className="sd-card-hover rounded-3xl border border-[#E4DAFA] bg-gradient-to-br from-[#FBFDFF] to-[#EDE5FF]/30 p-8">
              <div className="flex items-start gap-5">
                <Image
                  src={r.photo}
                  alt={r.name}
                  width={72}
                  height={72}
                  className="sd-person-ring h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg text-[#FD5501]">★★★★★</p>
                  <p className="mt-3 text-base leading-relaxed text-[#33353E]">{r.text}</p>
                  <div className="mt-4 border-t border-[#E9EBF5] pt-4">
                    <p className="font-bold text-[#33353E]">{r.name}</p>
                    <p className="text-sm text-[#666F94]">{r.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
