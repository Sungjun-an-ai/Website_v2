"use client"

import React from 'react'

type HistoryEvent = {
  year: number
  month: number | null
  event_ko: string
  event_en: string
}

interface HistoryHeroProps {
  events: HistoryEvent[]
  isKo: boolean
  title: string
}

export default function HistoryHero({ events, isKo, title }: HistoryHeroProps) {
  const scrollEvents = [...events, ...events]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/about/Aerial_timelapse_of_subway_con_Kling_30__16770.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/70 to-black/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_40%)]" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl pt-20 sm:pt-24">
          <div className="mb-8 sm:mb-10 text-left opacity-0 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards]">
            <div className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4">
              OUR HISTORY
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
          </div>

          <div className="opacity-0 animate-[fadeInUp_1.2s_ease-out_0.6s_forwards]">
            <div className="backdrop-blur-md bg-black/75 border border-white/25 rounded-2xl p-8 sm:p-12 shadow-2xl">
              <div className="border-t border-white/20 pt-8">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
                  {isKo ? '회사 연혁' : 'Company History'}
                </h2>
                <div className="h-64 overflow-hidden rounded-lg border border-white/20 bg-black/70">
                  <div className="animate-vertical-scroll">
                    {scrollEvents.map((event, idx) => (
                      <div
                        key={`${event.year}-${event.event_ko}-${idx}`}
                        className="flex items-start gap-4 border-b border-white/10 px-4 py-3 text-sm sm:text-base text-white/85 leading-relaxed"
                      >
                        <span className="w-16 shrink-0 text-gold font-semibold">
                          {event.year}
                        </span>
                        <span className="text-white/55">|</span>
                        <span className="flex-1">
                          {isKo ? event.event_ko : event.event_en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
