"use client"

import { useEffect } from 'react'

/**
 * Forces standalone full-screen pages to start at the very top when navigated
 * to from another (possibly taller, scrolled) route.
 *
 * Without this, arriving from a scrolled page can leave the window clamped near
 * the bottom: the shared footer is a `snap-page` snap target, and the global
 * `scroll-behavior: smooth` turns the reset scroll into an animation that gets
 * clamped on the shorter page. We drop the snap class, force instant scrolling,
 * and repeat the reset (mount + rAF + timeout) to beat the router's own scroll
 * handling.
 */
export default function ScrollResetOnMount() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('snap-page')
    const prevRestoration = history.scrollRestoration
    try {
      history.scrollRestoration = 'manual'
    } catch {
      /* not supported */
    }

    const prevBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    const scrollTop = () => window.scrollTo(0, 0)
    scrollTop()
    const raf = requestAnimationFrame(scrollTop)
    const timeout = setTimeout(scrollTop, 120)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      html.style.scrollBehavior = prevBehavior
      try {
        history.scrollRestoration = prevRestoration
      } catch {
        /* ignore */
      }
    }
  }, [])

  return null
}
