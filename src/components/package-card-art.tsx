import { PlatformLogo } from '@/components/platform-logo'

export type PackageServiceKind = 'followers' | 'likes' | 'views' | 'subscribers'

const KIND_LABEL: Record<PackageServiceKind, string> = {
  followers: 'Takipçi',
  likes: 'Beğeni',
  views: 'İzlenme',
  subscribers: 'Abone',
}

function ServiceBadge({ kind }: { kind: PackageServiceKind }) {
  const icons: Record<PackageServiceKind, string> = {
    followers: '👥',
    likes: '❤️',
    views: '▶️',
    subscribers: '🔔',
  }
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#33353E] shadow-sm">
      <span aria-hidden className="shrink-0">{icons[kind]}</span>
      <span className="truncate">{KIND_LABEL[kind]}</span>
    </span>
  )
}

export function PackageCardArt({
  platform,
  kind,
  accent,
  variant = 'light',
}: {
  platform: string
  kind: PackageServiceKind
  accent: string
  variant?: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`relative mb-3 flex min-h-[56px] items-center gap-2.5 overflow-hidden rounded-xl px-2.5 py-2 ${
        isDark ? 'bg-white/10' : ''
      }`}
      style={
        isDark
          ? undefined
          : { background: `linear-gradient(135deg, ${accent}20 0%, ${accent}08 100%)` }
      }
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: isDark
            ? `radial-gradient(circle at 80% 20%, ${accent}55, transparent 55%)`
            : `radial-gradient(circle at 85% 15%, ${accent}35, transparent 50%)`,
        }}
      />
      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isDark ? 'bg-white/15' : 'bg-white'
        }`}
      >
        <PlatformLogo platform={platform} size={24} />
      </div>
      <ServiceBadge kind={kind} />
    </div>
  )
}

export function inferPackageKind(title: string): PackageServiceKind {
  const t = title.toLowerCase()
  if (t.includes('beğeni') || t.includes('begeni')) return 'likes'
  if (t.includes('izlenme') || t.includes('saat')) return 'views'
  if (t.includes('abone')) return 'subscribers'
  return 'followers'
}
