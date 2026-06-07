type P = { className?: string; size?: number }

export function IconPhone({ className = '', size = 14 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

export function IconBell({ className = '', size = 20 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

export function IconCart({ className = '', size = 20 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

export function IconChevronDown({ className = '', size = 18 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 18 18">
      <path d="M3.75 6.75L9 12L14.25 6.75" stroke="#666F94" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArrowRight({ className = '', size = 20 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  )
}

export function IconShield({ className = '', size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

export function IconBolt({ className = '', size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

export function IconUsers({ className = '', size = 24 }: P) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="240" cy="200" r="160" fill="#EDE5FF" />
      <circle cx="240" cy="200" r="120" fill="#E4D8FD" />
      <rect x="175" y="80" width="130" height="240" rx="20" fill="#7844E4" />
      <rect x="185" y="95" width="110" height="200" rx="12" fill="#fff" />
      <rect x="195" y="110" width="90" height="60" rx="8" fill="#EDE5FF" />
      <circle cx="220" cy="135" r="12" fill="#7844E4" />
      <rect x="195" y="185" width="60" height="8" rx="4" fill="#E4D8FD" />
      <rect x="195" y="200" width="80" height="8" rx="4" fill="#E4D8FD" />
      <rect x="195" y="215" width="70" height="8" rx="4" fill="#E4D8FD" />
      <circle cx="120" cy="120" r="28" fill="#fff" stroke="#7844E4" strokeWidth="2" />
      <text x="120" y="126" textAnchor="middle" fill="#7844E4" fontSize="14" fontWeight="700">IG</text>
      <circle cx="360" cy="140" r="24" fill="#fff" stroke="#FD5501" strokeWidth="2" />
      <text x="360" y="146" textAnchor="middle" fill="#FD5501" fontSize="12" fontWeight="700">TK</text>
      <circle cx="380" cy="260" r="22" fill="#fff" stroke="#FF0000" strokeWidth="2" />
      <text x="380" y="266" textAnchor="middle" fill="#FF0000" fontSize="11" fontWeight="700">YT</text>
      <circle cx="100" cy="280" r="20" fill="#7844E4" />
      <path d="M92 280l6 6 12-12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="300" y="60" width="80" height="36" rx="18" fill="#10B981" />
      <text x="340" y="83" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">+10K</text>
    </svg>
  )
}
