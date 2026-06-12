import type { ReactNode } from 'react'

type LogoProps = { platform: string; size?: number; className?: string }
type IconProps = { size?: number; className?: string }

function SvgWrap({ size, className, children }: { size: number; className?: string; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

function InstagramIcon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size ?? 24} className={className}>
      <defs>
        <linearGradient id="ig" x1="0" y1="24" x2="24" y2="0">
          <stop stopColor="#f58529" />
          <stop offset="0.5" stopColor="#dd2a7b" />
          <stop offset="1" stopColor="#8134af" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)" />
      <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
    </SvgWrap>
  )
}

function TikTokIcon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size ?? 24} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#010101" />
      <path
        d="M14.5 7.5v6.2a2.8 2.8 0 11-2.8-2.8"
        stroke="#25F4EE"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.5 7.5V6.5h2.1v4.8a2.4 2.4 0 11-2.4-2.4"
        stroke="#FE2C55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 14.9a2.8 2.8 0 100-5.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </SvgWrap>
  )
}

function YouTubeIcon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size ?? 24} className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
      <path d="M10 9.5v5l5-2.5-5-2.5z" fill="#fff" />
    </SvgWrap>
  )
}

function TwitterIcon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size ?? 24} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#1DA1F2" />
      <path
        d="M7 8.5l4.2 5.6L7 17.5h1.8l3-3.8 2.4 3.8H18l-4.4-6 3.8-4.5h-1.8l-2.7 3.3L9.6 8.5H7z"
        fill="#fff"
      />
    </SvgWrap>
  )
}

function GenericIcon({ size, className }: IconProps) {
  return (
    <SvgWrap size={size ?? 24} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#7844E4" />
      <circle cx="12" cy="10" r="3" fill="#fff" />
      <path d="M6 18c1.2-2.8 3.4-4 6-4s4.8 1.2 6 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </SvgWrap>
  )
}

export function PlatformLogo({ platform, size = 24, className = '' }: LogoProps) {
  const p = platform.toUpperCase()
  if (p === 'INSTAGRAM') return <InstagramIcon size={size} className={className} />
  if (p === 'TIKTOK') return <TikTokIcon size={size} className={className} />
  if (p === 'YOUTUBE') return <YouTubeIcon size={size} className={className} />
  if (p === 'TWITTER' || p === 'TWITTER (X)' || p === 'X') return <TwitterIcon size={size} className={className} />
  return <GenericIcon size={size} className={className} />
}
