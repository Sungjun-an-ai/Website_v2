"use client"

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

type Stat = {
  id: string
  label_ko: string
  label_en: string
  value: string
  suffix: string
  order_index: number
  is_active: boolean
}

const fallbackStats: Stat[] = [
  {
    id: 'fallback-1',
    label_ko: '업력',
    label_en: 'Years of Experience',
    value: '36',
    suffix: '+',
    order_index: 1,
    is_active: true,
  },
  {
    id: 'fallback-2',
    label_ko: '거래처',
    label_en: 'Clients',
    value: '500',
    suffix: '+',
    order_index: 2,
    is_active: true,
  },
  {
    id: 'fallback-3',
    label_ko: '완료 프로젝트',
    label_en: 'Completed Projects',
    value: '1000',
    suffix: '+',
    order_index: 3,
    is_active: true,
  },
  {
    id: 'fallback-4',
    label_ko: '진행 현장',
    label_en: 'Active Sites',
    value: '30',
    suffix: '+',
    order_index: 4,
    is_active: true,
  },
]

function CountUp({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [end, started])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function StatsSection() {
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('stats')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
      .then(({ data, error }) => {
        if (error) console.error('[StatsSection] fetch error:', error)
        setStats(data || [])
      })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const sectionTitle = locale === 'ko' ? '한성우레탄의 숫자' : 'Hansung Urethane in Numbers'
  const displayStats = stats.length > 0 ? stats : fallbackStats

  return (
    <section className="relative min-h-screen w-full flex-shrink-0 snap-start bg-navy" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(1200px_280px_at_50%_0%,rgba(212,168,67,0.16),transparent_70%)] pointer-events-none" />

      <div className="sticky top-16 md:top-20 z-20 border-y border-white/10 bg-gradient-to-r from-navy-900/95 via-navy-700/95 to-navy-900/95 backdrop-blur">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <h2 className="text-base md:text-lg font-bold text-white whitespace-nowrap">{sectionTitle}</h2>
              <div className="w-10 h-0.5 bg-gold" />
            </div>

            <div className="md:hidden -mx-1 px-1 flex gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
              {displayStats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`snap-start min-w-[138px] rounded-lg px-3 py-2 border border-white/15 bg-white/5 transition-all duration-700 ${
                    started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${idx * 90}ms` }}
                >
                  <div className={`text-xl font-bold leading-none mb-1 ${idx === 0 ? 'text-gold' : 'text-white'}`}>
                    <CountUp
                      end={parseInt(stat.value, 10) || 0}
                      suffix={stat.suffix}
                      started={started}
                    />
                  </div>
                  <div className="text-[11px] text-gray-300 truncate">
                    {locale === 'ko' ? stat.label_ko : stat.label_en}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:grid grid-cols-4 gap-6 flex-1">
              {displayStats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`text-right transition-all duration-700 ${
                    started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${idx * 90}ms` }}
                >
                  <div className={`text-3xl font-bold leading-none mb-1 ${idx === 0 ? 'text-gold' : 'text-white'}`}>
                    <CountUp
                      end={parseInt(stat.value, 10) || 0}
                      suffix={stat.suffix}
                      started={started}
                    />
                  </div>
                  <div className="text-gray-300 text-xs tracking-wide">
                    {locale === 'ko' ? stat.label_ko : stat.label_en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[56vh] md:h-[60vh]" />
    </section>
  )
}
