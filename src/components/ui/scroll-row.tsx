import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** lg+ ekranda grid (ör. "lg:grid-cols-4") */
  desktopGrid?: string
}

/** Mobilde yatay kaydırma + sağ padding; lg+ grid ile kesilme yok */
export function ScrollRow({ children, className = '', desktopGrid }: Props) {
  const grid = desktopGrid ?? 'lg:grid-cols-4'

  return (
    <div className={`sd-scroll-track sd-scroll-track--responsive ${className}`}>
      <div className={`sd-scroll-row sd-scroll-row--responsive ${grid}`}>{children}</div>
    </div>
  )
}
