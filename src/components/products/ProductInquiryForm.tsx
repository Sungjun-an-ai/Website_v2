"use client"

import { FormEvent, useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ProductInquiryFormProps = {
  locale: string
  productName: string
  isKo: boolean
}

export default function ProductInquiryForm({ locale, productName, isKo }: ProductInquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productInterest: productName,
    message: '',
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
              <option value={productName}>{productName}</option>
              <option value="WS-3000">WS-3000</option>
              <option value="WS-7000">WS-7000</option>
              <option value="NFLV-친환경">NFLV-친환경</option>
              <option value="하나로 P">하나로 P</option>
              <option value="ID-비규제">ID-비규제</option>
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
        </form>
      )}
    </>
  )
}
