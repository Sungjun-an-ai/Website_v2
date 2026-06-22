"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

type Panel = {
  id: string
  media: string
  isVideo: boolean
  title: string
  tagline: string
  placeholder: string
  href: (locale: string) => string
}

const panels: Panel[] = [
  {
    id: 'sealant',
    media: '/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4',
    isVideo: true,
    title: '지수제',
    tagline: '누수 차단의 밀착과 내구성을 동시에',
    placeholder: 'linear-gradient(135deg, #1A2B6B, #0D1220)',
    href: (l) => `/${l}/products/ws-3000`,
  },
  {
    id: 'fire-door-adhesive',
    media: '/about/A_photorealistic_hero_image_on_Nano_Banana_2_74206.png',
    isVideo: false,
    title: '방화문 접착제',
    tagline: '방화 성능과 강력 접착의 완벽한 균형',
    placeholder: 'linear-gradient(135deg, #1E3A5F, #0D1B3E)',
    href: (l) => `/${l}/products/nflv-eco`,
  },
  {
    id: 'interior-door-adhesive',
    media: '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4',
    isVideo: true,
    title: '실내문 접착제',
    tagline: '저VOC · 강한 초기 접착력',
    placeholder: 'linear-gradient(135deg, #162D4A, #091525)',
    href: (l) => `/${l}/products/id`,
  },
  {
    id: 'general-adhesive',
    media: '/about/An_extreme_macro_close-up_of_u_Nano_Banana_Pro_81286.png',
    isVideo: false,
    title: '일반 접착제',
    tagline: '다양한 공정에 적용 가능한 범용 우레탄 접착',
    placeholder: 'linear-gradient(135deg, #243B55, #141E30)',
    href: (l) => `/${l}/products/hanaro-p`,
  },
  {
    id: 'urethane-solution',
    media: '/about/A_photorealistic_hero_image_se_Nano_Banana_Pro_42629.png',
    isVideo: false,
    title: '우레탄 솔루션',
    tagline: '제품을 넘어 공정 전체를 함께 설계하는 파트너십',
    placeholder: 'linear-gradient(135deg, #1A2B6B, #243B55)',
    href: (l) => `/${l}/about`,
  },
]

export default function ProductsSection() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggedRef = useRef(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const mobile = window.matchMedia('(max-width: 767px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let raf = 0
    let paused = false
    let dragging = false
    let startX = 0
    let startScroll = 0
    let setWidth = track.scrollWidth / 2
    let pos = viewport.scrollLeft // float accumulator (scrollLeft rounds to int)

    const recompute = () => {
      setWidth = track.scrollWidth / 2
    }

    const wrapPos = () => {
      if (setWidth <= 0) return
      if (pos >= setWidth) pos -= setWidth
      else if (pos < 0) pos += setWidth
    }

    const SPEED = 0.55 // px per frame
    const tick = () => {
      if (!setWidth) recompute()
      if (!paused && !dragging && !mobile.matches && !reduced.matches) {
        pos += SPEED
        wrapPos()
        viewport.scrollLeft = pos
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)

    const onEnter = () => {
      paused = true
    }
    const onLeave = () => {
      paused = false
    }

    const onPointerDown = (e: PointerEvent) => {
      if (mobile.matches) return
      dragging = true
      draggedRef.current = false
      startX = e.clientX
      startScroll = pos
      viewport.classList.add('ps-dragging')
      viewport.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 5) draggedRef.current = true
      pos = startScroll - dx
      wrapPos()
      viewport.scrollLeft = pos
    }
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      viewport.classList.remove('ps-dragging')
      try {
        viewport.releasePointerCapture(e.pointerId)
      } catch {
        /* noop */
      }
    }

    // Suppress click navigation right after a drag
    const onClickCapture = (e: MouseEvent) => {
      if (draggedRef.current) {
        e.preventDefault()
        e.stopPropagation()
        draggedRef.current = false
      }
    }

    const onResize = () => recompute()

    viewport.addEventListener('mouseenter', onEnter)
    viewport.addEventListener('mouseleave', onLeave)
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)
    viewport.addEventListener('click', onClickCapture, true)
    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(raf)
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
      viewport.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const renderSlat = (p: Panel, clone: boolean) => (
    <Link
      key={`${clone ? 'clone-' : ''}${p.id}`}
      href={p.href(locale)}
      className={`ps-slat${clone ? ' ps-clone' : ''}`}
      aria-label={p.title}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
      draggable={false}
    >
      <div className="ps-bg" style={{ background: p.placeholder }}>
        {p.isVideo ? (
          <video
            className="ps-media"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={p.media} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ps-media" src={p.media} alt="" draggable={false} />
        )}
      </div>
      <div className="ps-overlay" />
      <div className="ps-content">
        <h3 className="ps-name">{p.title}</h3>
        <p className="ps-tagline">{p.tagline}</p>
        <span className="ps-cta">{isKo ? '자세히 보기 →' : 'View details →'}</span>
      </div>
    </Link>
  )

  return (
    <section className="ps-section relative h-screen w-full flex-shrink-0 snap-start snap-always overflow-hidden">
      {/* Auto-scrolling, draggable slats fill the whole section */}
      <div className="ps-viewport" ref={viewportRef}>
        <div className="ps-track" ref={trackRef}>
          {panels.map((p) => renderSlat(p, false))}
          {panels.map((p) => renderSlat(p, true))}
        </div>
      </div>

      {/* Top gradient for header legibility */}
      <div className="ps-topfade" />

      {/* Header overlay */}
      <div className="ps-head">
        <div className="ps-label">PRODUCTS</div>
        <h2 className="ps-title">{isKo ? '한성우레탄 제품군' : 'Our Product Lineup'}</h2>
        <p className="ps-subtitle">
          {isKo
            ? '각 제품군을 클릭하면 상세 정보를 확인할 수 있습니다.'
            : 'Click each category to view its details.'}
        </p>
      </div>

      <style jsx global>{`
        .ps-section {
          font-family: 'Noto Sans KR', var(--font-pretendard), sans-serif;
          background: #0d1b3e;
        }

        .ps-viewport {
          position: absolute;
          inset: 0;
          overflow-x: auto;
          overflow-y: hidden;
          cursor: grab;
          scrollbar-width: none;
          -ms-overflow-style: none;
          touch-action: pan-y;
        }
        .ps-viewport::-webkit-scrollbar {
          display: none;
        }
        .ps-viewport.ps-dragging {
          cursor: grabbing;
        }
        .ps-track {
          display: flex;
          height: 100%;
          width: max-content;
        }

        .ps-slat {
          position: relative;
          flex: 0 0 30vw;
          height: 100%;
          overflow: hidden;
          transform: skewX(-8deg);
          margin-left: -14px;
          cursor: pointer;
          display: block;
          -webkit-user-select: none;
          user-select: none;
        }

        .ps-bg {
          position: absolute;
          inset: -6% -28%;
          transform: skewX(8deg);
          transition: transform 0.6s ease;
          overflow: hidden;
        }
        .ps-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
        }
        .ps-slat:hover .ps-bg {
          transform: skewX(8deg) scale(1.05);
        }
        .ps-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 20, 60, 0.92) 0%,
            rgba(10, 20, 60, 0.3) 50%,
            transparent 100%
          );
          transition: background 0.4s ease;
        }
        .ps-slat:hover .ps-overlay {
          background: linear-gradient(
            to top,
            rgba(10, 20, 60, 0.75) 0%,
            transparent 60%
          );
        }

        .ps-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 34px 40px;
          transform: skewX(8deg);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .ps-name {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1.25;
          padding-bottom: 6px;
          border-bottom: 3px solid transparent;
          transition: font-size 0.4s ease, border-color 0.4s ease;
        }
        .ps-slat:hover .ps-name {
          font-size: 1.95rem;
          border-bottom-color: #c9a227;
        }
        .ps-tagline {
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.85rem;
          margin-top: 8px;
          line-height: 1.5;
          transition: font-size 0.4s ease;
        }
        .ps-slat:hover .ps-tagline {
          font-size: 1.1rem;
        }
        .ps-cta {
          margin-top: 18px;
          display: inline-block;
          background: transparent;
          border: 1px solid #c9a227;
          color: #c9a227;
          padding: 8px 20px;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: 700;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease, background 0.25s ease,
            color 0.25s ease;
          pointer-events: none;
        }
        .ps-slat:hover .ps-cta {
          opacity: 1;
          transform: translateY(0);
        }
        .ps-cta:hover {
          background: #c9a227;
          color: #111827;
        }

        /* Top gradient */
        .ps-topfade {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 340px;
          z-index: 5;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(8, 16, 40, 0.95) 0%,
            rgba(8, 16, 40, 0.7) 38%,
            rgba(8, 16, 40, 0.25) 70%,
            transparent 100%
          );
        }

        /* Header overlay */
        .ps-head {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 6;
          text-align: center;
          padding: 104px 24px 0;
          pointer-events: none;
        }
        .ps-label {
          color: #c9a227;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .ps-title {
          color: #ffffff;
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .ps-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.72);
          margin-top: 12px;
        }

        /* Mobile: drop the marquee + skew, stack horizontal cards */
        @media (max-width: 767px) {
          .ps-section {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
          .ps-viewport {
            position: static;
            overflow-x: visible;
            cursor: default;
            padding: 220px 16px 32px;
          }
          .ps-track {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          .ps-clone {
            display: none;
          }
          .ps-slat {
            flex: none;
            height: 160px;
            transform: none;
            margin-left: 0;
            border-radius: 6px;
          }
          .ps-bg {
            inset: 0;
            transform: none;
          }
          .ps-slat:hover .ps-bg {
            transform: none;
          }
          .ps-content {
            transform: none;
            padding: 18px 20px;
          }
          .ps-name,
          .ps-slat:hover .ps-name {
            font-size: 1.2rem;
            border-bottom-color: transparent;
          }
          .ps-tagline,
          .ps-slat:hover .ps-tagline {
            font-size: 0.8rem;
          }
          .ps-cta {
            display: none;
          }
          .ps-topfade {
            height: 200px;
          }
        }
      `}</style>
    </section>
  )
}
