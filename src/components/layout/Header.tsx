"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: t('products'), href: `/${locale}/products/hs-100` },
    { label: t('about'), href: `/${locale}/about` },
    { label: t('history'), href: `/${locale}/about/history` },
    { label: t('trackRecord'), href: `/${locale}/about/track-record` },
    { label: t('resources'), href: `/${locale}/resources` },
    { label: t('notice'), href: `/${locale}/notice` },
  ]

  const otherLocale = locale === 'ko' ? 'en' : 'ko'
  const localePath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md text-navy'
          : 'bg-transparent text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-bold leading-tight",
                isScrolled ? 'text-navy' : 'text-white'
              )}>
                한성우레탄
              </span>
              <span className={cn(
                "text-xs tracking-widest",
                isScrolled ? 'text-gold' : 'text-gold-light'
              )}>
                HANSUNG URETHANE
              </span>
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
                  isScrolled ? 'text-gray-700' : 'text-white'
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
                isScrolled ? 'text-gray-700' : 'text-white'
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
                isScrolled ? 'text-navy' : 'text-white'
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
