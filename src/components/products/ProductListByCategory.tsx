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
  categoryId,
  categoryLabel,
  products,
  heroVisual,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [looping, setLooping] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const isVideo = !!heroVisual && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(heroVisual)
  const title = isKo ? categoryLabel.ko : categoryLabel.en

  // Reveal (RTL wipe) once the grid enters the viewport
  useEffect(() => {
    const el = setRef.current
    if (!el) {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Decide whether to enable the seamless downward auto-scroll loop
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

  // Downward auto-scroll marquee (only when looping is enabled)
  useEffect(() => {
    if (!looping) return
    const viewport = viewportRef.current
    const set = setRef.current
    if (!viewport || !set) return

    let raf = 0
    let paused = false
    let pos = viewport.scrollTop
    let setHeight = set.scrollHeight
    const SPEED = 0.4

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

  const renderCard = (p: ProductCatalogItem, index: number, clone: boolean) => {
    const name = isKo ? p.nameKo : p.nameEn
    const subtitle = isKo ? p.subtitleKo : p.subtitleEn
    const description = isKo ? p.descriptionKo : p.descriptionEn
    const tag = isKo ? p.tagKo : p.tagEn
    const open = openId === p.slug
    return (
      <Link
        key={`${clone ? 'c-' : ''}${p.slug}`}
        href={`/${locale}/products/${p.slug}`}
        className={`pl-card${revealed ? ' is-revealed' : ''}${open ? ' is-open' : ''}`}
        style={{ animationDelay: `${(index % products.length) * 90}ms` }}
        aria-hidden={clone || undefined}
        tabIndex={clone ? -1 : undefined}
        onClick={(e) => {
          // On touch devices first tap toggles, second navigates
          if (window.matchMedia('(hover: none)').matches && !open) {
            e.preventDefault()
            setOpenId(p.slug)
          }
        }}
      >
        <div className="pl-card-bg">
          {p.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pl-card-media" src={p.heroImage} alt="" draggable={false} />
          ) : (
            <div className="pl-card-fallback" />
          )}
        </div>
        <div className="pl-card-overlay" />
        <div className="pl-card-content">
          {tag && <span className="pl-card-tag">{tag}</span>}
          <h3 className="pl-card-name">{name}</h3>
          <p className="pl-card-sub">{subtitle}</p>
          <p className="pl-card-desc">{description}</p>
          <span className="pl-card-cta">{isKo ? '자세히 보기 →' : 'View details →'}</span>
        </div>
      </Link>
    )
  }

  return (
    <section className="pl-section">
      <div className="pl-bg-layer">
        {isVideo ? (
          <video className="pl-bg-media" autoPlay muted loop playsInline preload="metadata">
            <source src={heroVisual} type="video/mp4" />
          </video>
        ) : heroVisual ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pl-bg-media" src={heroVisual} alt="" />
        ) : null}
        <div className="pl-bg-tint" />
      </div>

      <div className="pl-head">
        <Link href={`/${locale}/products`} className="pl-back">
          <ArrowLeft size={16} />
          <span>{isKo ? '제품군' : 'Products'}</span>
        </Link>
        <div className="pl-eyebrow">{categoryId.toUpperCase()}</div>
        <h1 className="pl-title">{title}</h1>
        <p className="pl-count">
          {products.length}
          {isKo ? '개 제품' : ' products'}
        </p>
      </div>

      <div className="pl-viewport" ref={viewportRef}>
        <div className="pl-grid" ref={setRef}>
          {products.map((p, i) => renderCard(p, i, false))}
        </div>
        {looping && (
          <div className="pl-grid" aria-hidden>
            {products.map((p, i) => renderCard(p, i, true))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .pl-section {
          position: relative;
          min-height: 100vh;
          background: #0b1228;
          font-family: 'Noto Sans KR', var(--font-pretendard), sans-serif;
          padding-top: 96px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .pl-bg-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .pl-bg-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.25;
        }
        .pl-bg-tint {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11, 18, 40, 0.82) 0%, rgba(11, 18, 40, 0.95) 60%, #0b1228 100%);
        }

        .pl-head {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 32px 24px;
          text-align: left;
        }
        .pl-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 18px;
          transition: color 0.2s ease;
        }
        .pl-back:hover {
          color: #c9a227;
        }
        .pl-eyebrow {
          color: #c9a227;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 10px;
        }
        .pl-title {
          color: #fff;
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.15;
        }
        .pl-count {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
          margin-top: 8px;
        }

        .pl-viewport {
          position: relative;
          z-index: 1;
          flex: 1;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px 48px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pl-viewport::-webkit-scrollbar {
          display: none;
        }
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .pl-grid + .pl-grid {
          margin-top: 18px;
        }

        .pl-card {
          position: relative;
          display: block;
          min-height: 320px;
          border-radius: 12px;
          overflow: hidden;
          background: #111c3a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          clip-path: inset(0 0 0 100%);
          opacity: 0;
        }
        .pl-card.is-revealed {
          animation: plWipeRTL 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes plWipeRTL {
          from {
            clip-path: inset(0 0 0 100%);
            opacity: 0;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        .pl-card-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .pl-card-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .pl-card-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(150deg, #1a2b6b 0%, #0d1220 100%);
        }
        .pl-card:hover .pl-card-media,
        .pl-card.is-open .pl-card-media {
          transform: scale(1.06);
        }
        .pl-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 14, 33, 0.95) 18%, rgba(8, 14, 33, 0.45) 55%, rgba(8, 14, 33, 0.15) 100%);
          transition: background 0.4s ease;
        }
        .pl-card:hover .pl-card-overlay,
        .pl-card.is-open .pl-card-overlay {
          background: linear-gradient(to top, rgba(8, 14, 33, 0.97) 35%, rgba(8, 14, 33, 0.6) 75%, rgba(8, 14, 33, 0.3) 100%);
        }

        .pl-card-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          text-align: left;
        }
        .pl-card-tag {
          display: inline-block;
          background: rgba(201, 162, 39, 0.15);
          color: #e7c75a;
          border: 1px solid rgba(201, 162, 39, 0.4);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .pl-card-name {
          color: #fff;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .pl-card-sub {
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.82rem;
          margin-top: 8px;
          line-height: 1.45;
        }
        .pl-card-desc {
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.78rem;
          line-height: 1.5;
          margin-top: 10px;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.45s ease, opacity 0.35s ease, margin-top 0.35s ease;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .pl-card:hover .pl-card-desc,
        .pl-card.is-open .pl-card-desc {
          max-height: 140px;
          opacity: 1;
        }
        .pl-card-cta {
          color: #c9a227;
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 14px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .pl-card:hover .pl-card-cta,
        .pl-card.is-open .pl-card-cta {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1023px) {
          .pl-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .pl-section {
            padding-top: 80px;
          }
          .pl-head {
            padding: 24px 18px 16px;
          }
          .pl-title {
            font-size: 1.8rem;
          }
          .pl-viewport {
            padding: 0 18px 36px;
            overflow-y: visible;
          }
          .pl-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .pl-card {
            min-height: 240px;
          }
          .pl-card-desc {
            max-height: 140px;
            opacity: 1;
            margin-top: 10px;
          }
          .pl-card-cta {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
