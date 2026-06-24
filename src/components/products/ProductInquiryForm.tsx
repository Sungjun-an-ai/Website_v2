"use client"

import { FormEvent, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Toast, useToast } from '@/components/ui/toast'

type ProductInquiryFormProps = {
  locale: string
  productName: string
  isKo: boolean
  productOptions?: string[]
}

export default function ProductInquiryForm({ locale, productName, isKo, productOptions = [] }: ProductInquiryFormProps) {
  const { toast, showToast, hideToast } = useToast()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [agreed, setAgreed] = useState(false)
  const [showConsent, setShowConsent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productInterest: productName,
    message: '',
  })

  // Keep the selected product in sync with the active product shown on the page.
  useEffect(() => {
    setFormData((prev) => ({ ...prev, productInterest: productName }))
  }, [productName])

  const options = Array.from(
    new Set([productName, ...productOptions].filter(Boolean))
  )

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      })

      if (!res.ok) throw new Error('failed')

      setStatus('success')
      setAgreed(false)
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        productInterest: productName,
        message: '',
      })
    } catch {
      setStatus('error')
    }
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <CheckCircle className="h-12 w-12 text-gold mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {isKo ? '문의가 접수되었습니다!' : 'Inquiry Received!'}
          </h3>
          <p className="text-slate-300">
            {isKo ? '담당자가 빠르게 연락드리겠습니다.' : 'Our team will get back to you shortly.'}
          </p>
          <Button className="mt-6" onClick={() => setStatus('idle')}>
            {isKo ? '새 문의 작성' : 'New Inquiry'}
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-200">
                {isKo ? '이름 *' : 'Name *'}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder={isKo ? '이름을 입력해 주세요' : 'Enter your name'}
                required
                className="mt-1 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-slate-200">
                {isKo ? '회사명' : 'Company'}
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={onChange}
                placeholder={isKo ? '회사명을 입력해 주세요' : 'Enter your company'}
                className="mt-1 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-slate-200">
                {isKo ? '이메일 *' : 'Email *'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder={isKo ? '이메일 주소를 입력해 주세요' : 'Enter your email'}
                required
                className="mt-1 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-200">
                {isKo ? '연락처' : 'Phone'}
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder={isKo ? '연락처를 입력해 주세요' : 'Enter your phone'}
                className="mt-1 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="productInterest" className="text-slate-200">
              {isKo ? '제품' : 'Product'}
            </Label>
            <select
              id="productInterest"
              name="productInterest"
              value={formData.productInterest}
              onChange={onChange}
              className="mt-1 flex h-10 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="other">{isKo ? '기타' : 'Other'}</option>
            </select>
          </div>

          <div>
            <Label htmlFor="message" className="text-slate-200">
              {isKo ? '문의 내용 *' : 'Message *'}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onChange}
              placeholder={isKo ? '문의 내용을 입력해 주세요' : 'Tell us your requirements'}
              required
              rows={5}
              className="mt-1 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <AlertCircle className="h-4 w-4" />
              {isKo ? '전송 실패, 다시 시도해 주세요.' : 'Failed to send. Please try again.'}
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-gold text-white hover:bg-gold-dark"
            size="lg"
          >
            {status === 'sending' ? (isKo ? '전송 중...' : 'Sending...') : (isKo ? '문의 보내기' : 'Send Inquiry')}
          </Button>

          <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-200 select-none">
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
              className="mt-0.5 h-4 w-4 accent-gold cursor-pointer"
            />
            <span>
              {isKo
                ? '개인정보 수집 및 이용에 관한 동의'
                : 'I agree to the collection and use of personal information'}
            </span>
          </label>
        </form>
      )}

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
    </>
  )
}
