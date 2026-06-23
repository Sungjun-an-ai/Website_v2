"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

function HsuEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="52" stroke="#1B2A6B" strokeWidth="3" fill="none" />
      {/* Inner circle */}
      <circle cx="60" cy="60" r="42" stroke="#1B2A6B" strokeWidth="2" fill="none" />
      {/* H.S.U. text */}
      <text
        x="60" y="58" textAnchor="middle" dominantBaseline="middle"
        fontFamily="serif" fontWeight="bold" fontSize="18" fill="#1B2A6B" letterSpacing="2"
      >
        H.S.U.
      </text>
      {/* 한성우레탄 text below */}
      <text
        x="60" y="80" textAnchor="middle" dominantBaseline="middle"
        fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#1B2A6B" letterSpacing="1"
      >
        한성우레탄
      </text>
    </svg>
  )
}

export default function Header({ initialLogoUrl = null }: { initialLogoUrl?: string | null }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl)

  // Sync prop changes
  useEffect(() => {
    if (initialLogoUrl !== undefined) {
      setLogoUrl(initialLogoUrl)
    }
  }, [initialLogoUrl])

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document
      const scrollPos = target === document ? window.scrollY : (target as HTMLElement).scrollTop
      if (scrollPos !== undefined) {
        setScrollY(scrollPos)
        setIsScrolled(scrollPos > 10)
      }
    }
    window.addEventListener('scroll', handleScroll, true)

    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

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

  // GNB stays transparent on every page (matching the product pages); only the
  // logo box shrinks on scroll. Kept as a flag so text-color logic reads clearly.
  const isWhiteHeader = false
  const isNavItemActive = (href: string) => {
    // Only highlight "about" on its exact page, not on history/track-record subpages.
    if (href === `/${locale}/about`) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

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
          <Link href={`/${locale}`} className="flex-shrink-0 self-start">
            <div
              className={cn(
                "flex items-center justify-center transition-all duration-300 origin-top",
                !isScrolled
                  ? "bg-white rounded-b-xl shadow-md w-[110px] h-[110px] md:w-[172px] md:h-[172px] p-[10%]"
                  : "bg-white rounded-b-lg shadow-md w-24 h-16 md:w-36 md:h-20 p-2"
              )}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <HsuEmblem className="w-full h-full object-contain" />
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm hover:text-gold transition-colors gnb-text-shadow",
                  isWhiteHeader ? 'text-gray-700' : 'text-white',
                  isNavItemActive(item.href)
                    ? 'font-extrabold text-gold'
                    : 'font-medium'
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
                "hidden md:flex items-center gap-1 text-sm font-medium hover:text-gold transition-colors gnb-text-shadow",
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
                "md:hidden p-2 gnb-text-shadow",
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
