"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Resets window scroll to the top on every route (pathname) change.
 *
 * Full-screen snap pages (Home/About/Product) share a footer that is a
 * `scroll-snap-align: end` target, and the global `scroll-behavior: smooth`
 * turns the router's scroll reset into an animation that can clamp near the
 * bottom (footer) when arriving on a shorter page. This forces an instant
 * reset to the top for any page that isn't handling its own scroll.
 *
 * In-page anchor navigation (e.g. the header Contact button -> `/{locale}#contact`)
 * is respected: when a hash is present we let the browser/router scroll to it.
 */
export default function RouteScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Respect anchor navigation to in-page sections.
    if (window.location.hash) return

    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    const toTop = () => window.scrollTo(0, 0)
    toTop()
    // Re-assert after data/images settle to beat the router's own scroll
    // handling and the smooth-scroll clamp on shorter pages.
    const raf = requestAnimationFrame(toTop)
    const timeout = setTimeout(toTop, 120)
    const restore = setTimeout(() => { html.style.scrollBehavior = prevBehavior }, 160)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      clearTimeout(restore)
      html.style.scrollBehavior = prevBehavior
    }
  }, [pathname])

  return null
}
