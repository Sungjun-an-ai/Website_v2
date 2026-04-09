import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Printer, Mail, Clock } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="text-xl font-bold text-white">한성우레탄</div>
              <div className="text-xs text-gold tracking-widest mt-1">HANSUNG URETHANE</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              BONDING TOMORROW TOGETHER
            </p>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              {locale === 'ko'
                ? '36년 우레탄 접착제·지수제 전문 제조기업'
                : '36 years of urethane adhesive & sealant manufacturing'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/products/hs-100`} className="hover:text-gold transition-colors">{nav('products')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-gold transition-colors">{nav('about')}</Link></li>
              <li><Link href={`/${locale}/about/history`} className="hover:text-gold transition-colors">{nav('history')}</Link></li>
              <li><Link href={`/${locale}/about/track-record`} className="hover:text-gold transition-colors">{nav('trackRecord')}</Link></li>
              <li><Link href={`/${locale}/resources`} className="hover:text-gold transition-colors">{nav('resources')}</Link></li>
              <li><Link href={`/${locale}/notice`} className="hover:text-gold transition-colors">{nav('notice')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href={`tel:${t('phone')}`} className="hover:text-gold transition-colors">{t('phone')}</a>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-gold flex-shrink-0" />
                <span>{t('fax')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href={`mailto:${t('email')}`} className="hover:text-gold transition-colors">{t('email')}</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold flex-shrink-0" />
                <span>{locale === 'ko' ? '평일 09:00 - 18:00' : 'Mon-Fri 09:00 - 18:00 KST'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">{t('copyright')}</p>
          <div className="flex gap-4 text-xs">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-300 transition-colors">
              {t('links.privacy')}
            </Link>
            <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-300 transition-colors">
              {t('links.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
