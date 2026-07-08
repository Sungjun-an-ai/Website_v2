"use client"

import React, { useEffect, useState } from 'react'
import { Pin, Eye, ArrowLeft, Calendar } from 'lucide-react'
import type { Notice } from '@/data/notices'
import HeroMedia from '@/components/common/HeroMedia'

const FALLBACK_VIDEO = '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4'

interface NoticeHeroProps {
  notices: Notice[]
  isKo: boolean
  locale: string
  title?: string
  subtitle?: string
  mediaUrl?: string
}

function formatDate(value: string, isKo: boolean) {
  const d = new Date(value)
  if (isKo) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate(),
    ).padStart(2, '0')}`
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatLongDate(value: string, isKo: boolean) {
  return new Date(value).toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NoticeHero({ notices, isKo, locale, title, subtitle, mediaUrl }: NoticeHeroProps) {
  const [selected, setSelected] = useState<Notice | null>(null)

  const pinned = notices.filter((n) => n.is_pinned)
  const board = [...notices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const tickerSource = pinned.length > 0 ? pinned : notices

  // Open detail from a deep link (?post=ID), e.g. redirected from /notice/[id]
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('post')
    if (id) {
      const found = notices.find((n) => n.id === id)
      if (found) setSelected(found)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openNotice = (n: Notice) => (e: React.MouseEvent) => {
    e.preventDefault()
    setSelected(n)
    window.history.replaceState(null, '', `/${locale}/notice?post=${n.id}`)
  }
  const closeNotice = () => {
    setSelected(null)
    window.history.replaceState(null, '', `/${locale}/notice`)
  }

  const renderTickerItem = (n: Notice, key: string) => (
    <a
      key={key}
      href={`/${locale}/notice/${n.id}`}
      onClick={openNotice(n)}
      className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap group"
    >
      <span className="bg-gold text-white text-[11px] px-2 py-0.5 rounded-full font-semibold">
        {isKo ? '중요' : 'TOP'}
      </span>
      <span className="text-white/75 text-sm sm:text-base font-medium group-hover:text-white transition-colors">
        {isKo ? n.title_ko : n.title_en}
      </span>
      <span className="text-white/25 ml-2">/</span>
    </a>
  )

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <HeroMedia mediaUrl={mediaUrl} fallbackVideoSrc={FALLBACK_VIDEO} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/68 to-black/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24">
        <div className="w-full max-w-5xl">
          {/* Title */}
          <div className="mb-8 sm:mb-10 opacity-0 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards] text-left">
            <div className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4">
              NOTICE
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {title || (isKo ? '공지사항' : 'Notice Board')}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line">
                {subtitle}
              </p>
            )}
          </div>

          {/* Glass card */}
          <div className="w-full opacity-0 animate-[fadeInUp_1.2s_ease-out_0.6s_forwards]">
            <div className="backdrop-blur-md bg-black/75 border border-white/25 rounded-2xl p-8 sm:p-12 shadow-2xl">
              {selected ? (
                /* DETAIL VIEW (kept inside the same glass card) */
                <div>
                  <button
                    type="button"
                    onClick={closeNotice}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors mb-6 text-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {isKo ? '목록으로' : 'Back to List'}
                  </button>

                  <div className="border-b border-white/20 pb-6 mb-6">
                    {selected.is_pinned && (
                      <span className="inline-block bg-gold text-white text-xs px-2 py-0.5 rounded-full font-semibold mb-3">
                        {isKo ? '공지' : 'Notice'}
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                      {isKo ? selected.title_ko : selected.title_en}
                    </h2>
                    <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatLongDate(selected.created_at, isKo)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {selected.view_count}
                      </span>
                    </div>
                  </div>

                  <div className="h-80 overflow-y-auto pr-2 whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-white/85">
                    {isKo ? selected.content_ko : selected.content_en}
                  </div>
                </div>
              ) : (
                /* LIST VIEW */
                <div>
                  {/* TOP: important notices — single-row ticker */}
                  <div className="mb-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Pin className="h-4 w-4 text-gold" />
                      {isKo ? '중요 공지사항' : 'Important Notices'}
                    </h2>

                    <div className="relative overflow-x-auto rounded-lg border border-white/15 bg-black/50 py-3">
                      <div className="flex gap-8 w-max px-3">
                        {tickerSource.map((n, idx) => renderTickerItem(n, `l-${idx}`))}
                      </div>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-white/20 pt-8 mt-8">
                    {/* BOTTOM: board list — vertical auto-scroll */}
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                      {isKo ? '전체 공지사항' : 'All Notices'}
                    </h2>
                    <div className="h-80 overflow-y-auto rounded-lg border border-white/20 bg-black/70">
                      <div>
                        {board.map((notice, idx) => (
                          <a
                            key={`${notice.id}-${idx}`}
                            href={`/${locale}/notice/${notice.id}`}
                            onClick={openNotice(notice)}
                            className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-sm sm:text-base text-white/85 leading-relaxed hover:bg-white/5 transition-colors"
                          >
                            <span className="w-24 shrink-0 text-gold font-semibold">
                              {formatDate(notice.created_at, isKo)}
                            </span>
                            {notice.is_pinned && (
                              <span className="shrink-0 bg-gold/90 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                {isKo ? '공지' : 'Notice'}
                              </span>
                            )}
                            <span className="truncate flex-1 text-white font-medium">
                              {isKo ? notice.title_ko : notice.title_en}
                            </span>
                            <span className="hidden sm:flex items-center gap-1 text-white/50 text-xs shrink-0">
                              <Eye className="h-3 w-3" />
                              {notice.view_count}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 pt-8 pb-6">
        <div className="relative overflow-x-auto">
          <div className="flex gap-12 w-max px-4">
            {board.map((notice, idx) => (
              <div
                key={idx}
                className="text-white/60 text-sm sm:text-base font-medium flex-shrink-0 whitespace-nowrap hover:text-white/80 transition-colors"
              >
                {isKo ? notice.title_ko : notice.title_en}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
