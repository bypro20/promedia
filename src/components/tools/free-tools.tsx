'use client'

import { useMemo, useState, type ComponentType } from 'react'

const EXTRA_TAGS: Record<string, string[]> = {
  instagram: ['instagood', 'instagram', 'instadaily', 'photooftheday', 'love', 'like4like', 'followme', 'turkiye', 'kesfet', 'reels', 'reelsinstagram'],
  tiktok: ['tiktok', 'fyp', 'foryou', 'foryoupage', 'viral', 'trend', 'keşfet', 'tiktokturkiye'],
  genel: ['sosyalmedya', 'dijital', 'icerik', 'marketing', 'marka'],
}

export function HashtagTool() {
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'genel'>('instagram')

  const tags = useMemo(() => {
    const base = keyword.trim().toLowerCase().replace(/[^a-z0-9\u00C0-\u024F_]/gi, '')
    if (!base) return []
    const variants = [
      base,
      `${base}tr`,
      `${base}türkiye`,
      `${base}love`,
      `${base}daily`,
      `${base}life`,
      `${base}official`,
      `${base}fan`,
      `${base}2026`,
    ]
    const merged = [...new Set([...variants, ...(EXTRA_TAGS[platform] ?? [])])]
    return merged.slice(0, 30).map((t) => `#${t}`)
  }, [keyword, platform])

  function copyAll() {
    void navigator.clipboard.writeText(tags.join(' '))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[#33353E]">Anahtar kelime</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="fitness, moda, yemek..."
            className="mt-1.5 w-full rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#7844E4]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#33353E]">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as typeof platform)}
            className="mt-1.5 w-full rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#7844E4]"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="genel">Genel</option>
          </select>
        </div>
      </div>
      {tags.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 rounded-xl bg-[#F0F1F9] p-4">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#7844E4] shadow-sm">
                {t}
              </span>
            ))}
          </div>
          <button type="button" onClick={copyAll} className="rounded-xl bg-[#7844E4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6835d3]">
            Tümünü Kopyala
          </button>
        </>
      )}
    </div>
  )
}

export function CharCounterTool() {
  const [text, setText] = useState('')
  const bioLimit = 150
  const captionLimit = 2200
  const len = text.length

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Biyografi veya caption metninizi yazın..."
        className="w-full rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#7844E4]"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-xl p-4 ${len > bioLimit ? 'bg-red-50' : 'bg-[#EDE5FF]'}`}>
          <p className="text-xs font-bold uppercase text-[#666F94]">Biyografi limiti</p>
          <p className="text-2xl font-black text-[#33353E]">{len} / {bioLimit}</p>
          <p className="text-xs text-[#666F94]">{len > bioLimit ? `${len - bioLimit} karakter fazla` : `${bioLimit - len} karakter kaldı`}</p>
        </div>
        <div className={`rounded-xl p-4 ${len > captionLimit ? 'bg-red-50' : 'bg-[#EDE5FF]'}`}>
          <p className="text-xs font-bold uppercase text-[#666F94]">Caption limiti</p>
          <p className="text-2xl font-black text-[#33353E]">{len} / {captionLimit}</p>
          <p className="text-xs text-[#666F94]">{len > captionLimit ? `${len - captionLimit} karakter fazla` : `${captionLimit - len} karakter kaldı`}</p>
        </div>
      </div>
    </div>
  )
}

const BIO_TEMPLATES = [
  '🎯 {niche} | 📍 Türkiye\n✨ {cta}\n👇 {link}',
  '🔥 {niche} içerikleri\n💼 İş birlikleri: DM\n🔗 {link}',
  '☕ {niche} tutkunu\n📩 {cta}\n🌐 {link}',
]

export function BioTool() {
  const [niche, setNiche] = useState('Lifestyle')
  const [cta, setCta] = useState('Link için tıkla')
  const [link, setLink] = useState('prmdia.com')
  const [idx, setIdx] = useState(0)

  const bio = BIO_TEMPLATES[idx]
    .replace('{niche}', niche)
    .replace('{cta}', cta)
    .replace('{link}', link)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niş (Moda, Fitness...)" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA metni" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" className="rounded-xl border px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2">
        {BIO_TEMPLATES.map((_, i) => (
          <button key={i} type="button" onClick={() => setIdx(i)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${idx === i ? 'bg-[#7844E4] text-white' : 'bg-[#F0F1F9] text-[#666F94]'}`}>
            Şablon {i + 1}
          </button>
        ))}
      </div>
      <pre className="whitespace-pre-wrap rounded-xl bg-[#282D40] p-4 text-sm text-white">{bio}</pre>
      <button type="button" onClick={() => void navigator.clipboard.writeText(bio)} className="rounded-xl bg-[#7844E4] px-5 py-2.5 text-sm font-bold text-white">
        Bio&apos;yu Kopyala
      </button>
    </div>
  )
}

export function GrowthCalcTool() {
  const [current, setCurrent] = useState('1000')
  const [target, setTarget] = useState('10000')
  const [days, setDays] = useState('30')

  const cur = Number(current) || 0
  const tgt = Number(target) || 0
  const d = Number(days) || 1
  const need = Math.max(0, tgt - cur)
  const perDay = need / d
  const perWeek = perDay * 7

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs font-semibold text-[#666F94]">Mevcut takipçi</label>
          <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#666F94]">Hedef takipçi</label>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#666F94]">Süre (gün)</label>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
      </div>
      {tgt > cur && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#EDE5FF] p-4">
            <p className="text-xs text-[#666F94]">Gerekli artış</p>
            <p className="text-xl font-black text-[#7844E4]">+{need.toLocaleString('tr-TR')}</p>
          </div>
          <div className="rounded-xl bg-[#EDE5FF] p-4">
            <p className="text-xs text-[#666F94]">Günlük ortalama</p>
            <p className="text-xl font-black text-[#7844E4]">+{Math.ceil(perDay).toLocaleString('tr-TR')}</p>
          </div>
          <div className="rounded-xl bg-[#EDE5FF] p-4">
            <p className="text-xs text-[#666F94]">Haftalık ortalama</p>
            <p className="text-xl font-black text-[#7844E4]">+{Math.ceil(perWeek).toLocaleString('tr-TR')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function UsernameTool() {
  const [username, setUsername] = useState('')
  const u = username.trim()

  const rules = [
    { ok: u.length >= 1 && u.length <= 30, label: '1–30 karakter arası' },
    { ok: /^[a-zA-Z0-9._]*$/.test(u), label: 'Sadece harf, rakam, nokta ve alt çizgi' },
    { ok: !/^\./.test(u) && !/\.$/.test(u), label: 'Nokta ile başlamaz/bitenmez' },
    { ok: !/\.\./.test(u), label: 'Ardışık nokta yok' },
  ]
  const allOk = u.length > 0 && rules.every((r) => r.ok)

  return (
    <div className="space-y-4">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
        placeholder="kullanici_adi"
        className="w-full rounded-xl border border-[#E9EBF5] px-4 py-3 font-mono text-sm outline-none focus:border-[#7844E4]"
      />
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r.label} className={`flex items-center gap-2 text-sm ${r.ok ? 'text-green-600' : 'text-[#666F94]'}`}>
            <span>{r.ok ? '✓' : '○'}</span> {r.label}
          </li>
        ))}
      </ul>
      {u && (
        <p className={`rounded-xl p-3 text-sm font-semibold ${allOk ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'}`}>
          {allOk ? `@${u} format olarak uygun görünüyor` : 'Kullanıcı adı kurallara uymuyor — düzeltin'}
        </p>
      )}
    </div>
  )
}

export function FreeTrialTool() {
  return (
    <div className="rounded-xl bg-[#EDE5FF] p-6 text-center">
      <p className="text-lg font-bold text-[#33353E]">Ücretsiz deneme için kayıt olun</p>
      <p className="mt-2 text-sm text-[#666F94]">
        Kayıt olun ve 100 takipçilik başlangıç paketini hemen satın alın. Tüm paketler fiyatlarıyla birlikte listelenir.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a href="/kayit" className="rounded-xl bg-[#7844E4] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#6835d3]">Ücretsiz Kayıt</a>
        <a href="/hizmetler" className="rounded-xl border border-[#7844E4] px-6 py-2.5 text-sm font-bold text-[#7844E4] hover:bg-white">Hizmetleri Gör</a>
      </div>
    </div>
  )
}

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  'hashtag-olusturucu': HashtagTool,
  'karakter-sayaci': CharCounterTool,
  'bio-olusturucu': BioTool,
  'takipci-hesaplayici': GrowthCalcTool,
  'kullanici-adi-kontrol': UsernameTool,
  'ucretsiz-takipci': FreeTrialTool,
}

export function FreeToolWidget({ slug }: { slug: string }) {
  const Comp = TOOL_COMPONENTS[slug]
  if (!Comp) return null
  return <Comp />
}
