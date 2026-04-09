"use client"

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Download, FileText, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatFileSize } from '@/lib/utils'

const resources = [
  {
    id: '1',
    title_ko: 'HS-100 우레탄 접착제 기술 데이터 시트',
    title_en: 'HS-100 Urethane Adhesive Technical Data Sheet',
    description_ko: '제품 상세 사양, 물성 데이터, 시공 가이드 포함',
    description_en: 'Includes detailed specifications, physical properties, and application guide',
    file_type: 'PDF',
    file_size: 2048000,
    download_count: 234,
    thumbnail: null,
  },
  {
    id: '2',
    title_ko: 'HS-200 지수제 기술 데이터 시트',
    title_en: 'HS-200 Waterproof Sealant Technical Data Sheet',
    description_ko: '지수제 성능 데이터 및 시공 지침',
    description_en: 'Sealant performance data and application instructions',
    file_type: 'PDF',
    file_size: 1824000,
    download_count: 187,
    thumbnail: null,
  },
  {
    id: '3',
    title_ko: 'HS-300 방수제 기술 데이터 시트',
    title_en: 'HS-300 Waterproofing Agent Technical Data Sheet',
    description_ko: '방수제 도포 방법 및 물성 데이터',
    description_en: 'Waterproofing agent application method and physical data',
    file_type: 'PDF',
    file_size: 2150000,
    download_count: 312,
    thumbnail: null,
  },
  {
    id: '4',
    title_ko: 'HS-400 그라우트 기술 데이터 시트',
    title_en: 'HS-400 Grout Technical Data Sheet',
    description_ko: '그라우트 주입 방법 및 성능 기준',
    description_en: 'Grout injection method and performance standards',
    file_type: 'PDF',
    file_size: 1950000,
    download_count: 156,
    thumbnail: null,
  },
  {
    id: '5',
    title_ko: '한성우레탄 종합 카탈로그 2024',
    title_en: 'Hansung Urethane General Catalog 2024',
    description_ko: '전 제품 라인업 및 회사 소개 종합 카탈로그',
    description_en: 'Full product lineup and company introduction comprehensive catalog',
    file_type: 'PDF',
    file_size: 8500000,
    download_count: 567,
    thumbnail: null,
  },
  {
    id: '6',
    title_ko: '우레탄 시공 가이드북',
    title_en: 'Urethane Application Guidebook',
    description_ko: '현장 시공자를 위한 상세한 시공 매뉴얼',
    description_en: 'Detailed application manual for field applicators',
    file_type: 'PDF',
    file_size: 4200000,
    download_count: 423,
    thumbnail: null,
  },
]

interface DownloadFormData {
  name: string
  company: string
  email: string
  phone: string
}

export default function ResourcesPage() {
  const locale = useLocale()
  const t = useTranslations('resources')
  const isKo = locale === 'ko'

  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null)
  const [formData, setFormData] = useState<DownloadFormData>({ name: '', company: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleDownloadRequest = (resource: typeof resources[0]) => {
    setSelectedResource(resource)
    setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/catalog-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resourceId: selectedResource?.id,
          resourceTitle: isKo ? selectedResource?.title_ko : selectedResource?.title_en,
          locale,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setTimeout(() => {
          setSelectedResource(null)
          setFormData({ name: '', company: '', email: '', phone: '' })
          setStatus('idle')
        }, 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Resources</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              {/* Icon */}
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-navy" />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-navy mb-2 leading-tight">
                {isKo ? resource.title_ko : resource.title_en}
              </h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                {isKo ? resource.description_ko : resource.description_en}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">{resource.file_type}</span>
                  {formatFileSize(resource.file_size)}
                </span>
                <span>{resource.download_count.toLocaleString()} {t('downloadCount')}</span>
              </div>

              {/* Button */}
              <Button
                onClick={() => handleDownloadRequest(resource)}
                className="w-full"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('download')}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl relative">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {isKo ? '다운로드가 시작됩니다' : 'Download Starting'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isKo ? '잠시 후 자동으로 다운로드됩니다.' : 'Your download will start shortly.'}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-navy mb-1">{t('requestForm.title')}</h2>
                <p className="text-gray-500 text-sm mb-6">{t('requestForm.desc')}</p>
                <p className="text-sm font-medium text-gray-700 mb-4 bg-gray-50 rounded-lg p-3">
                  📄 {isKo ? selectedResource.title_ko : selectedResource.title_en}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="dl-name">{t('requestForm.name')} *</Label>
                    <Input
                      id="dl-name"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-company">{t('requestForm.company')}</Label>
                    <Input
                      id="dl-company"
                      value={formData.company}
                      onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-email">{t('requestForm.email')} *</Label>
                    <Input
                      id="dl-email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-phone">{t('requestForm.phone')}</Label>
                    <Input
                      id="dl-phone"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedResource(null)}
                      className="flex-1"
                    >
                      {t('requestForm.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {status === 'submitting' ? (isKo ? '처리 중...' : 'Processing...') : t('requestForm.submit')}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
