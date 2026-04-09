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

  return (
    <section className="bg-navy py-16 md:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{sectionTitle}</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                <CountUp
                  end={parseFloat(stat.value) || 0}
                  suffix={stat.suffix}
                  started={started}
                />
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                {locale === 'ko' ? stat.label_ko : stat.label_en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
