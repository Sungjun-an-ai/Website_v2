"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

function HsuEmblem({ size }: { size: number }) {
  const scale = size / 120
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="52" stroke="#1B2A6B" strokeWidth="3" fill="none" />
      {/* Inner circle */}
      <circle cx="60" cy="60" r="42" stroke="#1B2A6B" strokeWidth="2" fill="none" />
      {/* H.S.U. text */}
      <text
        x="60"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="serif"
        fontWeight="bold"
        fontSize={Math.round(18 * scale + 18 * (1 - scale))}
        fill="#1B2A6B"
        letterSpacing="2"
      >
        H.S.U.
      </text>
      {/* 한성우레탄 text below */}
      <text
        x="60"
        y="80"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="sans-serif"
        fontWeight="600"
        fontSize={Math.round(11 * scale + 11 * (1 - scale))}
        fill="#1B2A6B"
        letterSpacing="1"
      >
        한성우레탄
      </text>
    </svg>
  )
}

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const isMainPage = pathname === `/${locale}` || pathname === `/${locale}/`

  // Logo animation constants
  const HEADER_HEIGHT_PX = 80
  const LOGO_MAX_PX = 120
  const LOGO_MIN_PX = 64

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Logo box size: LOGO_MAX_PX when scrollY=0, LOGO_MIN_PX when scrollY>=HEADER_HEIGHT_PX
  const logoSize = Math.round(Math.max(LOGO_MIN_PX, LOGO_MAX_PX - (scrollY / HEADER_HEIGHT_PX) * (LOGO_MAX_PX - LOGO_MIN_PX)))

  const navItems = [
    { label: t('products'), href: `/${locale}/products` },
    { label: t('about'), href: `/${locale}/about` },
    { label: t('history'), href: `/${locale}/about/history` },
    { label: t('trackRecord'), href: `/${locale}/about/track-record` },
    { label: t('resources'), href: `/${locale}/resources` },
    { label: t('notice'), href: `/${locale}/notice` },
  ]

  const otherLocale = locale === 'ko' ? 'en' : 'ko'
  const localePath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  // Sub-pages always use white header; main page uses scroll-based transparency
  const isWhiteHeader = !isMainPage || isScrolled

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isWhiteHeader
          ? 'bg-white shadow-md text-navy'
          : 'bg-transparent text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Box */}
          <Link href={`/${locale}`} className="flex-shrink-0 relative" style={{ marginTop: logoSize > HEADER_HEIGHT_PX ? logoSize - HEADER_HEIGHT_PX : 0 }}>
            <div
              className="bg-gray-100 flex items-center justify-center transition-all duration-300 overflow-hidden"
              style={{ width: logoSize, height: logoSize }}
            >
              <HsuEmblem size={logoSize} />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium hover:text-gold transition-colors",
                  isWhiteHeader ? 'text-gray-700' : 'text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Link
              href={localePath}
              className={cn(
                "hidden md:flex items-center gap-1 text-sm font-medium hover:text-gold transition-colors",
                isWhiteHeader ? 'text-gray-700' : 'text-white'
              )}
            >
              <Globe className="h-4 w-4" />
              {otherLocale === 'ko' ? '한국어' : 'EN'}
            </Link>

            {/* Contact CTA */}
            <Link
              href={`/${locale}#contact`}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
            >
              {t('contact')}
            </Link>

            {/* Mobile menu button */}
            <button
              className={cn(
                "md:hidden p-2",
                isWhiteHeader ? 'text-navy' : 'text-white'
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-navy font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <Link
                href={localePath}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-navy"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe className="h-4 w-4" />
                {otherLocale === 'ko' ? '한국어' : 'English'}
              </Link>
              <Link
                href={`/${locale}#contact`}
                className="px-4 py-2 text-sm font-medium bg-gold text-white rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
