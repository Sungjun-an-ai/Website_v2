"use client"

import React, { useEffect, useRef, useState } from 'react'

type Section = {
  mainTitle: string
  subtitle: string
  image: string
  body: string
}

function AboutSection({ section }: { section: Section }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true))
          })
        } else {
          setVisible(false)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const getElementStyle = (delayMs: string): React.CSSProperties => visible
    ? { animation: `hero-fade-up 1.35s ${delayMs} cubic-bezier(0.2, 0.85, 0.2, 1) forwards` }
    : { opacity: 0 }

  return (
    <section
      ref={ref}
      className="relative snap-start h-screen overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${section.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_38%)]" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center">
        <div className="w-full max-w-5xl text-white pt-20">
          <div
            className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4 sm:mb-6 hero-fade-in"
            style={getElementStyle('0.14s')}
          >
            About Hansung Urethane
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-5 sm:mb-7 hero-fade-in"
            style={getElementStyle('0.34s')}
          >
            {section.mainTitle}
          </h2>
          <p
            className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug whitespace-pre-line mb-8 sm:mb-10 text-white/95 hero-fade-in"
            style={getElementStyle('0.56s')}
          >
            {section.subtitle}
          </p>
          <div
            className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-[72ch] hero-fade-in"
            style={getElementStyle('0.78s')}
          >
            {section.body.split('\n').map((line, i) => (
              <p key={i} className={`text-white/85 ${i > 0 ? 'mt-1' : ''}`}>
                {line.startsWith('✔️') ? (
                  <>
                    <span className="mr-2 inline-flex align-middle text-gold" aria-hidden="true">
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8.5L6.2 11.5L13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{line.replace(/^✔️?\s*/, '')}</span>
                  </>
                ) : (
                  line || '\u00A0'
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutSections({ sections }: { sections: Section[] }) {
  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar">
      {sections.map((section, i) => (
        <AboutSection key={i} section={section} />
      ))}
    </div>
  )
}
