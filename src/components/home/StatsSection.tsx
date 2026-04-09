"use client"

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const statsData = [
  { value: 1988, suffix: '', labelKey: 'founded', display: '1988' },
  { value: 36, suffix: '+', labelKey: 'experience', display: '36+' },
  { value: 50, suffix: '+', labelKey: 'products', display: '50+' },
  { value: 500, suffix: '+', labelKey: 'clients', display: '500+' },
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
  const t = useTranslations('stats')
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

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

  return (
    <section className="bg-navy py-16 md:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t('title')}</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  started={started}
                />
              </div>
              <div className="text-gray-300 text-sm md:text-base">{t(stat.labelKey as any)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
