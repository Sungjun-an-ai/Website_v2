"use client"

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Printer, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactSection() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productInterest: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', company: '', email: '', phone: '', productInterest: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Contact</div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t('title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {locale === 'ko' ? '문의가 접수되었습니다!' : 'Inquiry Received!'}
                </h3>
                <p className="text-gray-600">{t('form.success')}</p>
                <Button
                  className="mt-6"
                  onClick={() => setStatus('idle')}
                >
                  {locale === 'ko' ? '새 문의 작성' : 'New Inquiry'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('form.name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">{t('form.company')}</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t('form.companyPlaceholder')}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('form.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('form.emailPlaceholder')}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('form.phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('form.phonePlaceholder')}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productInterest">{t('form.product')}</Label>
                  <select
                    id="productInterest"
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                  >
                    <option value="">
                      {locale === 'ko' ? '제품 선택 (선택사항)' : 'Select Product (Optional)'}
                    </option>
                    <option value="HS-100">HS-100 {locale === 'ko' ? '우레탄 접착제' : 'Urethane Adhesive'}</option>
                    <option value="HS-200">HS-200 {locale === 'ko' ? '지수제' : 'Sealant'}</option>
                    <option value="HS-300">HS-300 {locale === 'ko' ? '방수제' : 'Waterproofing'}</option>
                    <option value="HS-400">HS-400 {locale === 'ko' ? '그라우트' : 'Grout'}</option>
                    <option value="other">{locale === 'ko' ? '기타' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">{t('form.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('form.messagePlaceholder')}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {t('form.error')}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full"
                  size="lg"
                >
                  {status === 'sending' ? t('form.sending') : t('form.submit')}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-navy rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">{locale === 'ko' ? '연락처 정보' : 'Contact Information'}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-gray-200">{t('info.address')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                  <a href={`tel:${t('info.phone')}`} className="text-gray-200 hover:text-gold transition-colors">
                    {t('info.phone')}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Printer className="h-5 w-5 text-gold flex-shrink-0" />
                  <span className="text-gray-200">{t('info.fax')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                  <a href={`mailto:${t('info.email')}`} className="text-gray-200 hover:text-gold transition-colors">
                    {t('info.email')}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gold flex-shrink-0" />
                  <span className="text-gray-200">{t('info.hours')}</span>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md h-64">
              <iframe
                title="Hansung Urethane Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.5!2d126.8978!3d37.8842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c958cf3b0b739%3A0x0!2z6rK96riw!5e0!3m2!1sko!2skr!4v1704067200000!5m2!1sko!2skr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
