"use client"

import Link from 'next/link'
import { useLocale } from 'next-intl'

export type OverviewPanel = {
  id: string
  media: string
  isVideo: boolean
  titleKo: string
  titleEn: string
  taglineKo: string
  taglineEn: string
  placeholder: string
  href: string
}

const PRODUCT_CATEGORIES = new Set([
  'sealant',
  'fire-door-adhesive',
  'general-adhesive',
  'interior-door-adhesive',
])

export default function CategoryOverview({ panels }: { panels: OverviewPanel[] }) {
  const locale = useLocale()
  const isKo = locale === 'ko'

  const targetHref = (p: OverviewPanel) =>
    PRODUCT_CATEGORIES.has(p.id)
      ? `/${locale}/products/category/${p.id}`
      : `/${locale}${p.href}`

  return (
    <section className="co-section">
      <div className="co-head">
        <div className="co-eyebrow">PRODUCTS</div>
        <h1 className="co-title">{isKo ? '한성우레탄 제품군' : 'Our Product Lineup'}</h1>
        <p className="co-subtitle">
          {isKo
            ? '제품군을 선택하면 해당 제품 목록을 확인할 수 있습니다.'
            : 'Select a category to browse its products.'}
        </p>
      </div>

      <div className="co-grid">
        {panels.map((p) => (
          <Link
            key={p.id}
            href={targetHref(p)}
            className="co-card"
            aria-label={isKo ? p.titleKo : p.titleEn}
          >
            <div className="co-card-bg" style={{ background: p.placeholder }}>
              {p.isVideo ? (
                <video className="co-card-media" autoPlay muted loop playsInline preload="metadata">
                  <source src={p.media} type="video/mp4" />
                </video>
              ) : p.media ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="co-card-media" src={p.media} alt="" draggable={false} />
              ) : null}
            </div>
            <div className="co-card-overlay" />
            <div className="co-card-content">
              <h2 className="co-card-name">{isKo ? p.titleKo : p.titleEn}</h2>
              <p className="co-card-tagline">{isKo ? p.taglineKo : p.taglineEn}</p>
              <span className="co-card-cta">{isKo ? '제품 보기 →' : 'View products →'}</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .co-section {
          min-height: 100vh;
          background: #0b1228;
          font-family: 'Noto Sans KR', var(--font-pretendard), sans-serif;
          padding: 128px 32px 64px;
        }
        .co-head {
          max-width: 1280px;
          margin: 0 auto 32px;
          text-align: left;
        }
        .co-eyebrow {
          color: #c9a227;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 10px;
        }
        .co-title {
          color: #fff;
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.15;
        }
        .co-subtitle {
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.98rem;
          margin-top: 12px;
        }
        .co-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .co-card {
          position: relative;
          display: block;
          min-height: 300px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .co-card-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .co-card-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .co-card:hover .co-card-media {
          transform: scale(1.05);
        }
        .co-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 14, 33, 0.92) 10%, rgba(8, 14, 33, 0.35) 55%, transparent 100%);
          transition: background 0.4s ease;
        }
        .co-card:hover .co-card-overlay {
          background: linear-gradient(to top, rgba(8, 14, 33, 0.8) 25%, transparent 75%);
        }
        .co-card-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 34px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          text-align: left;
        }
        .co-card-name {
          color: #fff;
          font-size: 1.7rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .co-card-tagline {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-top: 10px;
          line-height: 1.5;
          max-width: 90%;
        }
        .co-card-cta {
          color: #c9a227;
          font-size: 0.82rem;
          font-weight: 700;
          margin-top: 18px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .co-card:hover .co-card-cta {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 767px) {
          .co-section {
            padding: 96px 18px 48px;
          }
          .co-title {
            font-size: 1.8rem;
          }
          .co-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .co-card {
            min-height: 220px;
          }
          .co-card-cta {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
