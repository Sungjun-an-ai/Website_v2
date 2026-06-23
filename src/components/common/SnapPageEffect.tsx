"use client"

import { useEffect } from 'react'

/**
 * Enables document-level scroll snapping (html.snap-page) while mounted.
 *
 * Pages render full-screen `snap-start` sections that scroll on the window so
 * the shared footer stays in one scroll context. We disable the browser's
 * scroll restoration and start at the top so the page never restores to a
 * previous (e.g. bottom) scroll position before snapping turns on.
 *
 * The wrapper element that contains the sections must use `overflow-x: clip`
 * (not `hidden`) — `hidden` forces `overflow-y: auto`, which makes the wrapper
 * its own scroll container and silently disables `scroll-snap-type` on <html>.
 */
export default function SnapPageEffect() {
  useEffect(() => {
    const html = document.documentElement
    const prevRestoration = history.scrollRestoration
    try {
      history.scrollRestoration = 'manual'
    } catch {
      /* not supported */
    }
    window.scrollTo(0, 0)
    html.classList.add('snap-page')

    return () => {
      html.classList.remove('snap-page')
      try {
        history.scrollRestoration = prevRestoration
      } catch {
        /* ignore */
      }
    }
  }, [])

  return null
}
