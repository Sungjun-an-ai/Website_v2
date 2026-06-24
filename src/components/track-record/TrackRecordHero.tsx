"use client"

import React, { useEffect, useState } from 'react'
import ScrollResetOnMount from '@/components/common/ScrollResetOnMount'
import HeroMedia from '@/components/common/HeroMedia'

const FALLBACK_VIDEO = '/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4'

type StatItem = {
  value: string
  label: string
}

type TrackRecordRecord = {
  id?: string | number
  client_name_ko: string
  client_name_en: string
  project_ko: string
  project_en: string
  category?: string
}

const CATEGORY_LABELS: Record<string, { ko: string; en: string }> = {
  sealant: { ko: '지수제', en: 'Water-stop Agent' },
  firedoor: { ko: '방화문', en: 'Fire Door' },
  construction: { ko: '건설', en: 'Construction' },
  civil: { ko: '토목', en: 'Civil' },
  industrial: { ko: '산업', en: 'Industrial' },
  other: { ko: '기타', en: 'Other' },
}

interface TrackRecordHeroProps {
  stats: StatItem[]
  records: TrackRecordRecord[]
  isKo: boolean
  title?: string
  subtitle?: string
  mediaUrl?: string
}

export default function TrackRecordHero({ stats, records, isKo, title, subtitle, mediaUrl }: TrackRecordHeroProps) {
  const [displayValues, setDisplayValues] = useState<Record<number, number>>({})

  // Extract numeric values for counting animation
  const numericStats = stats.map(s => ({
    ...s,
    numValue: parseInt(s.value.replace(/\D/g, '')) || 0
  }))

  useEffect(() => {
    const timers: Array<ReturnType<typeof setInterval>> = []

    // Animate counter for each stat
    numericStats.forEach((stat, idx) => {
      let current = 0
      const target = stat.numValue
      const increment = Math.ceil(target / 30) // 30 frames for animation
      const interval = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(interval)
        }
        setDisplayValues(prev => ({ ...prev, [idx]: current }))
      }, 40)
      timers.push(interval)
    })

    return () => {
      timers.forEach(clearInterval)
    }
  }, [])

  // Interleave categories (지수제/방화문) so they alternate instead of being
  // grouped. Deterministic order keeps SSR and client markup in sync.
  const sealantRecords = (records || []).filter(r => r.category === 'sealant')
  const firedoorRecords = (records || []).filter(r => r.category === 'firedoor')
  const otherRecords = (records || []).filter(
    r => r.category !== 'sealant' && r.category !== 'firedoor'
  )
  const mixedRecords: TrackRecordRecord[] = []
  const maxLen = Math.max(sealantRecords.length, firedoorRecords.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < sealantRecords.length) mixedRecords.push(sealantRecords[i])
    if (i < firedoorRecords.length) mixedRecords.push(firedoorRecords[i])
  }
  mixedRecords.push(...otherRecords)

  // Ticker projects (unique project names)
  const tickerProjects = Array.from(
    new Map(mixedRecords.map(r => [
      r.project_ko,
      { ko: r.project_ko, en: r.project_en }
    ])).values()
  )

  // Scale the vertical list duration to the number of items so the speed
  // stays readable regardless of how many records are loaded.
  const verticalDuration = Math.max(60, mixedRecords.length * 1.4)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ScrollResetOnMount />
      {/* Hero Background with video */}
      <div className="absolute inset-0">
        <HeroMedia mediaUrl={mediaUrl} fallbackVideoSrc={FALLBACK_VIDEO} />
        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/68 to-black/78" />
        {/* Subtle radial light effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24">
        <div className="w-full max-w-5xl">
        {/* Title Section */}
        <div className="mb-8 sm:mb-10 opacity-0 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards] text-left">
          <div className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4">
            TRACK RECORD
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            {title || (isKo ? '납품사례' : 'Track Record')}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line">
              {subtitle}
            </p>
          )}
        </div>

        {/* Glass Box Container */}
        <div className="w-full opacity-0 animate-[fadeInUp_1.2s_ease-out_0.6s_forwards]">
          <div className="backdrop-blur-md bg-black/75 border border-white/25 rounded-2xl p-8 sm:p-12 shadow-2xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {numericStats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
                    <span>{displayValues[idx] || 0}</span>
                    <span>{stat.value.includes('+') ? '+' : ''}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Track Record Title */}
            <div className="border-t border-white/20 pt-8">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                {isKo ? '주요 납품 실적' : 'Major Projects'}
              </h2>
              <div className="h-48 overflow-hidden rounded-lg border border-white/20 bg-black/70">
                <div className="animate-vertical-scroll" style={{ animationDuration: `${verticalDuration}s` }}>
                  {[...mixedRecords, ...mixedRecords].map((record, idx) => {
                    const cat = CATEGORY_LABELS[record.category ?? '']
                    return (
                    <div
                      key={`${record.id ?? 'record'}-${idx}`}
                      className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-sm sm:text-base text-white/85 leading-relaxed"
                    >
                      <span className="w-16 shrink-0 text-gold font-semibold">{cat ? (isKo ? cat.ko : cat.en) : ''}</span>
                      <span className="shrink-0 text-white font-medium">
                        {isKo ? record.client_name_ko : record.client_name_en}
                      </span>
                      <span className="text-white/50">|</span>
                      <span className="truncate">{isKo ? record.project_ko : record.project_en}</span>
                    </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 pt-8 pb-6">
        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-scroll">
            {[...Array(2)].map((_, setIdx) => (
              <React.Fragment key={setIdx}>
                {tickerProjects.map((project, idx) => (
                  <div
                    key={`${setIdx}-${idx}`}
                    className="text-white/60 text-sm sm:text-base font-medium flex-shrink-0 whitespace-nowrap hover:text-white/80 transition-colors"
                  >
                    {isKo ? project.ko : project.en}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 opacity-0 animate-[fadeInUp_1s_ease-out_1.5s_forwards]">
        <div className="text-white/50 text-xs mb-2 text-center">Scroll</div>
        <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/30 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
