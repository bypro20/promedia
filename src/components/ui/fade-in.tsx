'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const dirClass =
    direction === 'up'
      ? 'sd-animate-up'
      : direction === 'down'
        ? 'sd-animate-down'
        : direction === 'left'
          ? 'sd-animate-left'
          : direction === 'right'
            ? 'sd-animate-right'
            : 'sd-animate-fade'

  return (
    <div
      ref={ref}
      className={`sd-reveal ${dirClass} ${visible ? 'sd-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
