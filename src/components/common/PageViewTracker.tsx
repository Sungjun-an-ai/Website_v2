"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/admin')) return
    if (last.current === pathname) return
    last.current = pathname

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || '',
      locale,
    })

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname, locale])

  return null
}
