import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Printer, Mail, Clock } from 'lucide-react'

type ContactInfo = { address: string; phone: string; fax: string; email: string; hours: string }

export default function Footer({ contact }: { contact?: ContactInfo } = {}) {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer className="snap-footer bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col items-end text-right">
          {/* Brand */}
          <div className="mb-4">
            <div className="text-xl font-bold text-white">
              {locale === 'ko' ? '한성우레탄 주식회사' : 'Hansung Urethane Co., Ltd.'}
            </div>
            <div className="text-xs text-gold tracking-widest mt-1">HANSUNG URETHANE CO., LTD</div>
          </div>
          <p
            className="leading-[1.05]"
            style={{ fontFamily: 'Impact, "Haettenschweiler", "Arial Narrow Bold", sans-serif', fontSize: '36px' }}
          >
            <span className="block text-white">BONDING</span>
            <span className="block text-gold">TOMORROW</span>
            <span className="block text-white">TOGETHER</span>
          </p>

          {/* Quick Links — below the motto, laid out horizontally, left-aligned */}
          <div className="mt-6 w-full text-left">
            <h3 className="text-white font-semibold mb-3">{t('quickLinks')}</h3>
            <ul className="flex flex-wrap justify-start gap-x-5 gap-y-2 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-gold transition-colors">{nav('products')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-gold transition-colors">{nav('about')}</Link></li>
              <li><Link href={`/${locale}/about/history`} className="hover:text-gold transition-colors">{nav('history')}</Link></li>
              <li><Link href={`/${locale}/about/track-record`} className="hover:text-gold transition-colors">{nav('trackRecord')}</Link></li>
              <li><Link href={`/${locale}/resources`} className="hover:text-gold transition-colors">{nav('resources')}</Link></li>
              <li><Link href={`/${locale}/notice`} className="hover:text-gold transition-colors">{nav('notice')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info (moved to bottom) */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4">{t('contactInfo')}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
              <span>{contact?.address || t('address')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold flex-shrink-0" />
              <a href={`tel:${contact?.phone || t('phone')}`} className="hover:text-gold transition-colors">{contact?.phone || t('phone')}</a>
            </li>
            <li className="flex items-center gap-2">
              <Printer className="h-4 w-4 text-gold flex-shrink-0" />
              <span>{contact?.fax || t('fax')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold flex-shrink-0" />
              <a href={`mailto:${contact?.email || t('email')}`} className="hover:text-gold transition-colors">{contact?.email || t('email')}</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold flex-shrink-0" />
              <span>{contact?.hours || (locale === 'ko' ? '평일 09:00 - 18:00' : 'Mon-Fri 09:00 - 18:00 KST')}</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-navy-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            {locale === 'ko'
              ? `© ${new Date().getFullYear()} 한성우레탄 주식회사. All rights reserved.`
              : `© ${new Date().getFullYear()} Hansung Urethane Co., Ltd. All rights reserved.`}
          </p>
          <div className="flex gap-4 text-xs">
            <Link href={`/${locale}/privacy`} className="text-gray-500 hover:text-gray-300 transition-colors">
              {t('links.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-gray-500 hover:text-gray-300 transition-colors">
              {t('links.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
