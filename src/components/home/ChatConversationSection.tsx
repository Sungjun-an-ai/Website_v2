"use client"

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'

export type Slide = {
  customer: string
  hansung: string
  image: string
  name: string
  tag: string
  cta: string
  href: string
}

export default function ChatConversationSection({ slides: slidesProp }: { slides?: Slide[] } = {}) {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const LOGO_SRC = '/assets/logo.png'

    const slides: Slide[] = slidesProp && slidesProp.length > 0 ? slidesProp : [
      {
        customer: '시공 후 얼마 안 돼 누수가 재발합니다',
        hansung:
          '수압 환경에서도 팽창·밀착 성능을 유지하는 지수재입니다. 터널·지하주차장·수처리시설 현장에서 검증되었습니다.',
        image: '/assets/product-jisu.jpg',
        name: '한성우레탄 지수재',
        tag: '수압 환경 검증 완료',
        cta: '지수재 제품 보기 →',
        href: `/${locale}/products`,
      },
      {
        customer: '접착제가 들뜨거나 냄새 민원이 자꾸 들어옵니다',
        hansung:
          '강한 초기 접착력과 저VOC를 동시에 구현한 접착제입니다. 방화문·실내도어 제조사가 선택하는 이유입니다.',
        image: '/assets/product-adhesive.jpg',
        name: '한성우레탄 접착제',
        tag: '저VOC · 강력 접착',
        cta: '접착제 제품 보기 →',
        href: `/${locale}/products`,
      },
      {
        customer: '우레탄 소재가 필요한데, 어디에 물어봐야 할지 모릅니다',
        hansung:
          '점도·경도·색상·포장 단위까지 원하는 대로 맞춤 배합 상담이 가능합니다. 자체 연구소에서 직접 대응합니다.',
        image: '/assets/product-custom.jpg',
        name: '맞춤 배합 솔루션',
        tag: '자체 연구소 직접 대응',
        cta: '맞춤 솔루션 문의 →',
        href: `/${locale}#contact`,
      },
    ]

    const $ = (sel: string) => root.querySelector(sel) as HTMLElement | null
    const card = $('#cc-card')!
    const customerRow = $('#cc-customerRow')!
    const hansungRow = $('#cc-hansungRow')!
    const customerBubble = $('#cc-customerBubble')!
    const hansungBubble = $('#cc-hansungBubble')!
    const productImage = $('#cc-productImage') as HTMLImageElement
    const productName = $('#cc-productName')!
    const productTag = $('#cc-productTag')!
    const ctaBtn = $('#cc-ctaBtn') as HTMLAnchorElement
    const dotsWrap = $('#cc-dots')!
    const prevBtn = $('#cc-prevBtn')!
    const nextBtn = $('#cc-nextBtn')!

    let current = 0

    // Hansung avatar: use logo image (fallback to "H")
    const avatarEl = $('#cc-hansungAvatar')!
    {
      const probe = new Image()
      probe.onload = () => {
        avatarEl.textContent = ''
        const img = document.createElement('img')
        img.src = LOGO_SRC
        img.alt = '한성우레탄'
        avatarEl.appendChild(img)
      }
      probe.onerror = () => {
        avatarEl.textContent = 'H'
      }
      probe.src = LOGO_SRC
    }

    // pause-aware scheduler
    type Task = { cb: () => void; remaining: number; start: number; id: number; done: boolean }
    let timers: Task[] = []

    const schedule = (cb: () => void, delay: number) => {
      const task: Task = { cb, remaining: delay, start: Date.now(), id: 0, done: false }
      task.id = window.setTimeout(() => {
        task.done = true
        cb()
      }, delay)
      timers.push(task)
    }
    const clearTimers = () => {
      timers.forEach((t) => clearTimeout(t.id))
      timers = []
    }

    // character-by-character typewriter (pause-aware via scheduler)
    const typeText = (el: HTMLElement, text: string, perChar: number) => {
      el.textContent = ''
      const caret = document.createElement('span')
      caret.className = 'cc-caret'
      el.appendChild(caret)
      let typed = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text.charAt(i)
        schedule(() => {
          typed += ch
          el.textContent = typed
          el.appendChild(caret)
        }, (i + 1) * perChar)
      }
      schedule(() => {
        if (caret.parentNode) caret.parentNode.removeChild(caret)
      }, (text.length + 1) * perChar)
    }

    const resetVisuals = () => {
      card.classList.remove('cc-revealed')
      customerRow.classList.remove('cc-show')
      hansungRow.classList.remove('cc-show')
      customerBubble.textContent = ''
      hansungBubble.innerHTML = ''
    }

    const imageStatus = new Map<string, boolean>() // src -> loaded?

    const loadProductImage = (src: string) => {
      productImage.style.display = 'none'
      const known = imageStatus.get(src)
      if (known === true) {
        productImage.src = src
        productImage.style.display = 'block'
        return
      }
      if (known === false) {
        return // already failed -> keep navy placeholder, don't re-request
      }
      const probe = new Image()
      probe.onload = () => {
        imageStatus.set(src, true)
        productImage.src = src
        productImage.style.display = 'block'
      }
      probe.onerror = () => {
        imageStatus.set(src, false)
        productImage.style.display = 'none'
      }
      probe.src = src
    }

    const updateDots = () => {
      dotsWrap.querySelectorAll('.cc-dot').forEach((d, i) => {
        d.classList.toggle('cc-active', i === current)
      })
    }

    const goTo = (index: number) => {
      clearTimers()
      current = (index + slides.length) % slides.length
      const s = slides[current]

      resetVisuals()
      productName.textContent = s.name
      productTag.textContent = s.tag
      ctaBtn.textContent = s.cta
      ctaBtn.setAttribute('href', s.href)
      loadProductImage(s.image)
      updateDots()

      void card.offsetWidth // force reflow so transitions replay

      const PER_CHAR = 75
      const SLIDE_IN = 600
      const typeDur = s.customer.length * PER_CHAR
      const AFTER_TYPE = 800
      const DOTS_DUR = 1800
      const AFTER_ANSWER = 1700
      const AFTER_REVEAL = 3400

      const dotsStart = SLIDE_IN + typeDur + AFTER_TYPE
      const answerStart = dotsStart + DOTS_DUR
      const revealStart = answerStart + AFTER_ANSWER
      const nextStart = revealStart + AFTER_REVEAL

      schedule(() => {
        customerRow.classList.add('cc-show')
        typeText(customerBubble, s.customer, PER_CHAR)
      }, SLIDE_IN)

      schedule(() => {
        hansungBubble.innerHTML =
          '<span class="cc-typing-dots"><span></span><span></span><span></span></span>'
        hansungRow.classList.add('cc-show')
      }, dotsStart)

      schedule(() => {
        hansungBubble.textContent = s.hansung
      }, answerStart)

      schedule(() => {
        card.classList.add('cc-revealed')
      }, revealStart)

      schedule(() => goTo(current + 1), nextStart)
    }

    // build dots
    const dotHandlers: Array<() => void> = []
    slides.forEach((_, i) => {
      const b = document.createElement('button')
      b.className = 'cc-dot' + (i === 0 ? ' cc-active' : '')
      b.setAttribute('aria-label', `${i + 1}번 슬라이드`)
      const handler = () => goTo(i)
      b.addEventListener('click', handler)
      dotHandlers.push(handler)
      dotsWrap.appendChild(b)
    })

    const onPrev = () => goTo(current - 1)
    const onNext = () => goTo(current + 1)

    prevBtn.addEventListener('click', onPrev)
    nextBtn.addEventListener('click', onNext)

    // Entrance: head text + card rise up first, THEN the chat begins.
    const ENTRANCE_MS = 1000
    let started = false
    let startTimer = 0
    const startSection = () => {
      if (started) return
      started = true
      root.classList.add('cc-entered')
      startTimer = window.setTimeout(() => goTo(0), ENTRANCE_MS)
    }

    const sectionEl = root.closest('.cc-section')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) startSection()
        })
      },
      { threshold: 0.35 },
    )
    if (sectionEl) io.observe(sectionEl)
    else startSection()

    return () => {
      clearTimers()
      clearTimeout(startTimer)
      io.disconnect()
      prevBtn.removeEventListener('click', onPrev)
      nextBtn.removeEventListener('click', onNext)
      dotsWrap.innerHTML = ''
    }
  }, [locale, slidesProp])

  return (
    <section className="cc-section relative h-screen w-full flex-shrink-0 snap-start snap-always overflow-y-auto flex flex-col justify-center pt-24 pb-16 md:pt-28">
      <div ref={rootRef} className="w-full">
        {/* Section head — left aligned */}
        <div className="cc-head">
          <div className="cc-eyebrow">Field Conversations</div>
          <h2>{isKo ? '현장의 대화에서 시작되는 솔루션' : 'Solutions that start from real field conversations'}</h2>
          <p>{isKo ? '현장에서 자주 듣는 질문에, 한성우레탄이 어떻게 답하는지 확인해 보세요.' : 'See how Hansung Urethane answers the questions we hear most often on site.'}</p>
        </div>

        <div className="cc-carousel">
          <button className="cc-arrow cc-prev" id="cc-prevBtn" aria-label="이전 슬라이드">
            &#10094;
          </button>
          <button className="cc-arrow cc-next" id="cc-nextBtn" aria-label="다음 슬라이드">
            &#10095;
          </button>

          <div className="cc-card" id="cc-card">
            {/* LEFT: chat */}
            <div className="cc-chat-panel">
              <div className="cc-chat-inner">
                {/* Customer row (typewriter) */}
                <div className="cc-chat-row cc-customer" id="cc-customerRow">
                  <div className="cc-avatar-col">
                    <div className="cc-avatar cc-customer-avatar" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
                        <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" fill="#9CA3AF" />
                      </svg>
                    </div>
                    <div className="cc-avatar-label">{isKo ? '현장 담당자' : 'Site Manager'}</div>
                  </div>
                  <div className="cc-bubble cc-bubble-customer" id="cc-customerBubble" />
                </div>

                {/* Hansung row: SAME slot for typing dots and the answer */}
                <div className="cc-chat-row cc-hansung" id="cc-hansungRow">
                  <div className="cc-bubble cc-bubble-hansung" id="cc-hansungBubble" />
                  <div className="cc-avatar-col">
                    <div className="cc-avatar cc-hansung-avatar" id="cc-hansungAvatar">
                      H
                    </div>
                    <div className="cc-avatar-label">{isKo ? '한성우레탄' : 'Hansung Urethane'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: product reveal */}
            <div className="cc-product-panel" id="cc-productPanel">
              <div className="cc-product-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img id="cc-productImage" alt="" />
                <div className="cc-overlay" />
                <div className="cc-overlay-text">
                  <div className="cc-pname" id="cc-productName" />
                  <div className="cc-ptag" id="cc-productTag" />
                </div>
              </div>
              <a className="cc-cta-btn" id="cc-ctaBtn" href="#" />
            </div>
          </div>

          <div className="cc-dots" id="cc-dots" />
        </div>
      </div>

      <style jsx global>{`
        .cc-section {
          font-family: 'Noto Sans KR', var(--font-pretendard), sans-serif;
          background-image: linear-gradient(rgba(27, 42, 107, 0.3), rgba(27, 42, 107, 0.3)), image-set(url('/assets/section-bg.webp') type('image/webp'), url('/assets/section-bg.jpg') type('image/jpeg'));
          background-color: #1b2a6b;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Entrance: head + carousel rise up before chat begins */
        .cc-head,
        .cc-carousel {
          opacity: 0;
          transform: translateY(42px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cc-entered .cc-head,
        .cc-entered .cc-carousel {
          opacity: 1;
          transform: translateY(0);
        }
        .cc-entered .cc-carousel {
          transition-delay: 0.18s;
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-head,
          .cc-carousel {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }

        .cc-head {
          text-align: left;
          margin: 0 auto 28px;
          width: 100%;
          max-width: 1080px;
          padding: 0 16px;
        }
        .cc-eyebrow {
          color: #c9a227;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 10px;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
        }
        .cc-head h2 {
          color: #ffffff;
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        }
        @media (min-width: 768px) {
          .cc-head h2 { font-size: 3rem; }
        }
        @media (min-width: 1024px) {
          .cc-head h2 { font-size: 3.75rem; }
        }
        .cc-head p {
          color: #f3f4f6;
          font-size: 0.95rem;
          margin-top: 12px;
          line-height: 1.7;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
        }

        .cc-carousel {
          position: relative;
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .cc-card {
          position: relative;
          background: #ffffff;
          border-top: 3px solid #c9a227;
          border-radius: 6px;
          box-shadow: 0 4px 20px rgba(26, 43, 107, 0.1);
          overflow: hidden;
          display: flex;
          min-height: 440px;
        }

        .cc-chat-panel {
          flex: 0 0 100%;
          max-width: 100%;
          padding: 32px 28px;
          display: flex;
          align-items: center;
          transition: flex-basis 0.6s ease, max-width 0.6s ease;
        }
        .cc-card.cc-revealed .cc-chat-panel {
          flex-basis: 55%;
          max-width: 55%;
        }

        .cc-chat-inner {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
          transition: margin 0.6s ease;
        }

        .cc-product-panel {
          flex: 0 0 0%;
          max-width: 0%;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #f8f9fc;
          border-left: 1px solid #eceef4;
          opacity: 0;
          overflow: hidden;
          transition: flex-basis 0.6s ease, max-width 0.6s ease, opacity 0.6s ease,
            padding 0.6s ease;
        }
        .cc-card.cc-revealed .cc-product-panel {
          flex-basis: 45%;
          max-width: 45%;
          padding: 20px;
          opacity: 1;
        }

        .cc-chat-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .cc-chat-row.cc-customer {
          justify-content: flex-start;
          transform: translateX(-22px);
        }
        .cc-chat-row.cc-hansung {
          justify-content: flex-end;
          transform: translateX(22px);
        }
        .cc-chat-row.cc-show {
          opacity: 1;
          transform: translateX(0);
        }

        .cc-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          width: 56px;
        }
        .cc-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .cc-customer-avatar { background: #d1d5db; }
        .cc-customer-avatar svg { width: 22px; height: 22px; }
        .cc-hansung-avatar {
          background: #ffffff;
          border: 1px solid #d1d5db;
          color: #1a2b6b;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 3px;
        }
        .cc-hansung-avatar img { width: 100%; height: 100%; object-fit: contain; }
        .cc-avatar-label {
          font-size: 0.68rem;
          color: #6b7280;
          white-space: nowrap;
        }

        .cc-bubble {
          max-width: 75%;
          padding: 12px 16px;
          font-size: 0.92rem;
          line-height: 1.55;
          min-height: 44px;
        }
        .cc-bubble-customer {
          background: #f3f4f6;
          color: #111827;
          border-radius: 4px 18px 18px 18px;
          font-style: italic;
        }
        .cc-bubble-hansung {
          background: #1a2b6b;
          color: #ffffff;
          border-radius: 18px 4px 18px 18px;
          display: inline-flex;
          align-items: center;
        }

        .cc-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #6b7280;
          margin-left: 1px;
          vertical-align: -2px;
          animation: cc-blink 0.9s steps(1) infinite;
        }
        @keyframes cc-blink {
          50% { opacity: 0; }
        }

        .cc-typing-dots {
          display: inline-flex;
          gap: 5px;
          align-items: center;
        }
        .cc-typing-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          animation: cc-bounce 1.2s infinite ease-in-out;
        }
        .cc-typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .cc-typing-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cc-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .cc-product-img {
          position: relative;
          flex: 1 1 auto;
          min-height: 240px;
          border-radius: 6px;
          overflow: hidden;
          background: #1a2b6b;
        }
        .cc-product-img img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent, rgba(15, 25, 70, 0.85));
        }
        .cc-overlay-text {
          position: absolute;
          left: 18px;
          bottom: 16px;
          color: #fff;
          z-index: 2;
        }
        .cc-pname { font-weight: 700; font-size: 1.2rem; line-height: 1.3; }
        .cc-ptag { font-size: 0.9rem; opacity: 0.85; margin-top: 4px; }

        .cc-cta-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 13px 16px;
          background: #c9a227;
          color: #111827;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }
        .cc-cta-btn:hover { background: #1a2b6b; color: #ffffff; }

        .cc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1a2b6b;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: background 0.25s ease, color 0.25s ease;
          z-index: 5;
        }
        .cc-arrow:hover { background: #c9a227; color: #111827; }
        .cc-prev { left: -8px; }
        .cc-next { right: -8px; }

        .cc-dots {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 26px;
        }
        .cc-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease;
        }
        .cc-dot.cc-active { background: #c9a227; }

        @media (min-width: 1160px) {
          .cc-prev { left: -60px; }
          .cc-next { right: -60px; }
        }

        @media (max-width: 768px) {
          .cc-card { flex-direction: column; min-height: 0; }
          .cc-chat-panel,
          .cc-card.cc-revealed .cc-chat-panel {
            flex: 1 1 auto;
            max-width: 100%;
            padding: 24px 20px;
          }
          .cc-chat-inner { max-width: 100%; }
          .cc-product-panel,
          .cc-card.cc-revealed .cc-product-panel {
            flex: 1 1 auto;
            max-width: 100%;
            padding: 20px;
            border-left: none;
            border-top: 1px solid #eceef4;
          }
          .cc-product-img { min-height: 200px; }
          .cc-arrow { display: none; }
          .cc-head h2 { font-size: 1.4rem; }
        }
      `}</style>
    </section>
  )
}
