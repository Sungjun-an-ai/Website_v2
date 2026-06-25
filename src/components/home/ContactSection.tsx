"use client"

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Toast, useToast } from '@/components/ui/toast'
import { CheckCircle, AlertCircle } from 'lucide-react'

type ContactInfo = { address: string; phone: string; fax: string; email: string; hours: string }

export default function ContactSection({ contact }: { contact?: ContactInfo } = {}) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const isKo = locale === 'ko'
  const { toast, showToast, hideToast } = useToast()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [agreed, setAgreed] = useState(false)
  const [showConsent, setShowConsent] = useState(false)
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
    if (!agreed) {
      showToast(
        isKo
          ? '문의 처리를 위한 개인정보 수집 동의가 필요합니다'
          : 'Please agree to the collection of personal information to submit your inquiry.',
        'error',
      )
      return
    }
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
        setAgreed(false)
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
    <section
      id="contact"
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-y-auto flex flex-col justify-center bg-navy py-16"
    >
      {/* Background image — lazy-loaded so it doesn't block the initial page load
          (this is the last section on the home page). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://ansdfjxettdrggezibwh.supabase.co/storage/v1/object/public/media/1782203838277_A_cinematic_photorealistic_her_Nano_Banana_2_33024.png"
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Gray 50% overlay */}
      <div className="absolute inset-0 bg-gray-500/50" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Contact</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h2>
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
                    <option value="HS-200">HS-200 {locale === 'ko' ? '지수제' : 'Water-stop Agent'}</option>
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

                <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => {
                      if (agreed) {
                        setAgreed(false)
                      } else {
                        setShowConsent(true)
                      }
                    }}
                    className="mt-0.5 h-4 w-4 accent-navy cursor-pointer"
                  />
                  <span>
                    {isKo
                      ? '개인정보 수집 및 이용에 관한 동의'
                      : 'I agree to the collection and use of personal information'}
                  </span>
                </label>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="relative aspect-[1.9/1] flex flex-col bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] p-8">
              {/* Logo top-right */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo.png"
                alt={isKo ? '한성우레탄' : 'Hansung Urethane'}
                className="absolute top-6 right-6 z-10 h-28 w-auto"
              />
              {/* Title top-left */}
              <h3 className="relative z-10 text-3xl font-bold text-navy mt-[15pt]">
                {isKo ? '한성우레탄' : 'Hansung Urethane'}
              </h3>
              {/* Bottom row: motto (left) + details (right), same vertical span */}
              <div className="relative z-10 mt-auto flex items-stretch justify-between gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/motto-contact.svg"
                  alt="BONDING TOMORROW TOGETHER"
                  className="h-16 sm:h-24 w-auto self-end object-contain object-left"
                />
                <ul className="space-y-1 text-sm text-black leading-tight text-right">
                  <li>{contact?.address || t('info.address')}</li>
                  <li>
                    <a href={`tel:${contact?.phone || t('info.phone')}`} className="hover:text-navy transition-colors">
                      {contact?.phone || t('info.phone')}
                    </a>
                  </li>
                  <li>{contact?.fax || t('info.fax')}</li>
                  <li>
                    <a href={`mailto:${contact?.email || t('info.email')}`} className="hover:text-navy transition-colors">
                      {contact?.email || t('info.email')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md h-64">
              <iframe
                title="Hansung Urethane Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  '경기 파주시 광탄면 장지산로 184-12',
                )}&hl=${locale}&z=16&output=embed`}
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

      {/* Personal information consent modal */}
      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base leading-snug">
              {isKo
                ? '[안내] 문의 접수를 위한 개인정보 수집·이용 동의'
                : '[Notice] Consent to Collection and Use of Personal Information'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {isKo
              ? `빠른 문의 처리 및 회신을 위해 아래와 같이 개인정보를 수집합니다.

- 수집 목적 : 문의 접수 및 답변 제공
- 수집 항목 : 이름, 회사명, 연락처, 이메일
- 보유 기간 : 목적 달성 후 즉시 파기 (또는 3년)

동의를 거부하실 수 있으며, 거부 시 문의 접수가 제한됩니다.`
              : `We collect the following personal information for prompt handling of and replies to your inquiry.

- Purpose : Receiving inquiries and providing answers
- Items : Name, company, contact number, email
- Retention : Destroyed immediately after the purpose is fulfilled (or 3 years)

You may decline consent; declining will restrict your inquiry submission.`}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConsent(false)}>
              {isKo ? '취소' : 'Cancel'}
            </Button>
            <Button
              onClick={() => {
                setAgreed(true)
                setShowConsent(false)
              }}
            >
              {isKo ? '동의' : 'Agree'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </section>
  )
}
