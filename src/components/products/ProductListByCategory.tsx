"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ProductCatalogItem } from '@/lib/products/catalog'

type Props = {
  locale: string
  isKo: boolean
  categoryId: string
  categoryLabel: { ko: string; en: string }
  products: ProductCatalogItem[]
  heroVisual?: string
}

export default function ProductListByCategory({
  locale,
  isKo,
  categoryLabel,
  products,
  heroVisual,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [looping, setLooping] = useState(false)

  const title = isKo ? categoryLabel.ko : categoryLabel.en

  // Trigger the staggered right-to-left wipe shortly after mount
  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 120)
    return () => window.clearTimeout(t)
  }, [])

  // Enable the seamless downward auto-scroll only when the stack overflows
  useEffect(() => {
    const decide = () => {
      const viewport = viewportRef.current
      const set = setRef.current
      if (!viewport || !set) return
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const overflows = set.scrollHeight > viewport.clientHeight + 8
      setLooping(overflows && !mobile && !reduced)
    }
    decide()
    window.addEventListener('resize', decide)
    return () => window.removeEventListener('resize', decide)
  }, [products.length])

  // Downward marquee
  useEffect(() => {
    if (!looping) return
    const viewport = viewportRef.current
    const set = setRef.current
    if (!viewport || !set) return

    let raf = 0
    let paused = false
    let pos = viewport.scrollTop
    let setHeight = set.scrollHeight
    const SPEED = 0.45

    const recompute = () => {
      setHeight = set.scrollHeight
    }
    const onEnter = () => {
      paused = true
    }
    const onLeave = () => {
      paused = false
    }
    const onManual = () => {
      pos = viewport.scrollTop
    }

    const tick = () => {
      if (!paused) {
        pos += SPEED
        if (setHeight > 0 && pos >= setHeight) pos -= setHeight
        viewport.scrollTop = pos
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)

    viewport.addEventListener('mouseenter', onEnter)
    viewport.addEventListener('mouseleave', onLeave)
    viewport.addEventListener('wheel', onManual, { passive: true })
    viewport.addEventListener('touchmove', onManual, { passive: true })
    window.addEventListener('resize', recompute)

    return () => {
      window.cancelAnimationFrame(raf)
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
      viewport.removeEventListener('wheel', onManual)
      viewport.removeEventListener('touchmove', onManual)
      window.removeEventListener('resize', recompute)
    }
  }, [looping])

  const renderBand = (p: ProductCatalogItem, index: number, clone: boolean) => {
    const name = isKo ? p.nameKo : p.nameEn
    const subtitle = isKo ? p.subtitleKo : p.subtitleEn
    const tag = isKo ? p.tagKo : p.tagEn
    const animate = !clone && revealed
    const media = p.heroImage || heroVisual || ''
    const isVideo = !!media && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(media)
    return (
      <Link
        key={`${clone ? 'c-' : ''}${p.slug}`}
        href={`/${locale}/products/${p.slug}`}
        className={`pb-band${clone ? ' is-clone' : animate ? ' is-revealed' : ''}`}
        style={!clone ? { animationDelay: `${index * 140}ms` } : undefined}
        aria-hidden={clone || undefined}
        tabIndex={clone ? -1 : undefined}
      >
        <div className="pb-band-bg">
          {isVideo ? (
            <video className="pb-band-media" autoPlay muted loop playsInline preload="metadata">
              <source src={media} type="video/mp4" />
            </video>
          ) : media ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pb-band-media" src={media} alt="" draggable={false} />
          ) : (
            <div className="pb-band-fallback" />
          )}
        </div>
        <div className="pb-band-overlay" />
        <div className="pb-band-content">
          {tag && <span className="pb-band-tag">{tag}</span>}
          <h3 className="pb-band-name">{name}</h3>
          <p className="pb-band-sub">{subtitle}</p>
        </div>
        <span className="pb-band-cta">{isKo ? '자세히 보기 →' : 'View details →'}</span>
      </Link>
    )
  }

  return (
    <section className="pb-section">
      <div className="pb-viewport" ref={viewportRef}>
        <div className="pb-stack" ref={setRef}>
          <div className="pb-spacer" aria-hidden />
          {products.map((p, i) => renderBand(p, i, false))}
        </div>
        {looping && (
          <div className="pb-stack" aria-hidden>
            <div className="pb-spacer" aria-hidden />
            {products.map((p, i) => renderBand(p, i, true))}
          </div>
        )}
      </div>

      {/* Top gradient + title */}
      <div className="pb-topfade" />
      <div className="pb-head">
        <Link href={`/${locale}/products`} className="pb-back">
          <ArrowLeft size={16} />
          <span>{isKo ? '제품군' : 'Products'}</span>
        </Link>
        <div className="pb-eyebrow">{categoryLabel.en.toUpperCase()}</div>
        <h1 className="pb-title">{title}</h1>
      </div>

      <style jsx global>{`
        .pb-section {
          position: relative;
          height: 100vh;
          width: 100%;
          background: #0b1228;
          font-family: 'Noto Sans KR', var(--font-pretendard), sans-serif;
          overflow: hidden;
          /* Left edge of the GNB logo: centered max-w-7xl (1280px) + px-4 */
          --logo-left: calc(max(0px, (100vw - 1280px) / 2) + 16px);
        }
        @media (min-width: 640px) {
          .pb-section {
            --logo-left: calc(max(0px, (100vw - 1280px) / 2) + 24px);
          }
        }
        @media (min-width: 1024px) {
          .pb-section {
            --logo-left: calc(max(0px, (100vw - 1280px) / 2) + 32px);
          }
        }
        .pb-viewport {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pb-viewport::-webkit-scrollbar {
          display: none;
        }
        .pb-stack {
          display: flex;
          flex-direction: column;
        }
        .pb-spacer {
          flex: 0 0 auto;
          width: 100%;
          height: 320px;
          pointer-events: none;
        }

        .pb-band {
          position: relative;
          display: block;
          width: 100%;
          height: clamp(170px, 24vh, 260px);
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          clip-path: inset(0 0 0 100%);
        }
        .pb-band.is-clone {
          clip-path: inset(0 0 0 0);
        }
        .pb-band.is-revealed {
          animation: pbWipeFromRight 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes pbWipeFromRight {
          from {
            clip-path: inset(0 0 0 100%);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }

        .pb-band-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .pb-band-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s ease;
        }
        .pb-band-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, #1a2b6b 0%, #0d1220 100%);
        }
        .pb-band:hover .pb-band-media {
          transform: scale(1.05);
        }
        .pb-band-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8, 14, 33, 0.92) 0%,
            rgba(8, 14, 33, 0.7) 38%,
            rgba(8, 14, 33, 0.3) 70%,
            rgba(8, 14, 33, 0.15) 100%
          );
          transition: background 0.4s ease;
        }
        .pb-band:hover .pb-band-overlay {
          background: linear-gradient(
            to right,
            rgba(8, 14, 33, 0.85) 0%,
            rgba(8, 14, 33, 0.5) 55%,
            rgba(8, 14, 33, 0.2) 100%
          );
        }

        .pb-band-content {
          position: absolute;
          z-index: 2;
          left: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
          padding: 0 clamp(24px, 6vw, 96px);
          padding-left: var(--logo-left);
          max-width: calc(760px + var(--logo-left));
        }
        .pb-band-tag {
          display: inline-block;
          background: rgba(201, 162, 39, 0.15);
          color: #e7c75a;
          border: 1px solid rgba(201, 162, 39, 0.4);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .pb-band-name {
          color: #fff;
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          font-weight: 800;
          line-height: 1.15;
        }
        .pb-band-sub {
          color: rgba(255, 255, 255, 0.8);
          font-size: clamp(0.85rem, 1.4vw, 1.05rem);
          margin-top: 10px;
          line-height: 1.5;
        }
        .pb-band-cta {
          position: absolute;
          z-index: 2;
          right: clamp(24px, 6vw, 96px);
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          color: #c9a227;
          font-size: 0.9rem;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .pb-band:hover .pb-band-cta {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        /* Top gradient for title legibility */
        .pb-topfade {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 320px;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(8, 16, 40, 0.96) 0%,
            rgba(8, 16, 40, 0.92) 55%,
            rgba(8, 16, 40, 0.5) 82%,
            transparent 100%
          );
        }
        .pb-head {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 5;
          padding: 196px clamp(24px, 6vw, 96px) 0;
          padding-left: var(--logo-left);
          pointer-events: none;
        }
        .pb-back {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 14px;
          transition: color 0.2s ease;
        }
        .pb-back:hover {
          color: #c9a227;
        }
        .pb-eyebrow {
          color: #c9a227;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 8px;
        }
        .pb-title {
          color: #fff;
          font-size: clamp(1.9rem, 3.6vw, 2.8rem);
          font-weight: 800;
          line-height: 1.1;
        }

        @media (max-width: 767px) {
          .pb-section {
            height: auto;
            min-height: 100vh;
          }
          .pb-viewport {
            position: static;
            overflow-y: visible;
            padding-top: 0;
          }
          .pb-band {
            height: 200px;
          }
          .pb-band-cta {
            display: none;
          }
          .pb-head {
            padding-top: 134px;
          }
          .pb-spacer {
            height: 240px;
          }
          .pb-topfade {
            height: 240px;
          }
        }
      `}</style>
    </section>
  )
}
