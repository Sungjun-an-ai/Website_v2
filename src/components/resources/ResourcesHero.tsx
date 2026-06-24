"use client"

import React, { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Download, X, CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatFileSize } from '@/lib/utils'
import {
  resources as fallbackResources,
  categoryOrder,
  categoryLabels,
  groupLabels,
  type Resource,
  type ResourceCategory,
} from '@/data/resources'

interface DownloadFormData {
  name: string
  company: string
  email: string
  phone: string
}

const formatBadge = 'bg-white/25 text-white'

export default function ResourcesHero({ resources: resourcesProp }: { resources?: Resource[] } = {}) {
  const resources = resourcesProp ?? fallbackResources
  const locale = useLocale()
  const t = useTranslations('resources')
  const isKo = locale === 'ko'

  const [activeCat, setActiveCat] = useState<ResourceCategory | 'all'>('all')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState<DownloadFormData>({ name: '', company: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const filtered = useMemo(
    () => (activeCat === 'all' ? resources : resources.filter((r) => r.category === activeCat)),
    [activeCat, resources],
  )

  // Build a seamless marquee unit (repeat short lists so the loop fills the row).
  const strip = useMemo(() => {
    if (filtered.length === 0) return []
    let unit = filtered
    while (unit.length < 8) unit = [...unit, ...filtered]
    return [...unit, ...unit]
  }, [filtered])

  const handleDownloadRequest = (resource: Resource) => {
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
          resourceTitle: isKo ? selectedResource?.name_ko : selectedResource?.name_en,
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

  const renderCard = (r: Resource, key: string) => (
    <div
      key={key}
      className="group relative w-[200px] sm:w-[220px] flex-shrink-0 aspect-[1/1.61] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-xl flex flex-col overflow-hidden transition-colors hover:bg-white/[0.16]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {/* Top: category (left) + format (right) */}
      <div className="relative flex items-start justify-between gap-2 mb-4">
        <span className="bg-gold text-navy text-[11px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
          {(categoryLabels[r.category] ? (isKo ? categoryLabels[r.category].ko : categoryLabels[r.category].en) : r.category)}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${formatBadge}`}>
          {r.format}
        </span>
      </div>

      {/* Bottom-right aligned: product / resource name */}
      <div className="relative mt-auto flex flex-col items-end text-right">
        <div className="text-white/55 text-xs font-medium">
          {(groupLabels[r.group] ? (isKo ? groupLabels[r.group].ko : groupLabels[r.group].en) : r.group)}
        </div>
        <div className="text-white/80 text-sm font-semibold mb-2">{r.product}</div>
        <h3 className="text-white font-bold text-base sm:text-lg leading-snug">
          {isKo ? r.name_ko : r.name_en}
        </h3>

        <div className="flex items-center gap-1.5 text-white/50 text-xs mt-3 mb-3">
          <FileText className="h-3.5 w-3.5" />
          {formatFileSize(r.size)}
        </div>
        <button
          type="button"
          onClick={() => handleDownloadRequest(r)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold text-navy font-bold text-sm py-2.5 transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4" />
          {t('download')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/about/Aerial_timelapse_of_Seoul_at_g_Kling_30__41996.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/68 to-black/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-12 py-28 sm:py-32">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <div className="mb-8 sm:mb-10 opacity-0 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards] text-left">
            <div className="text-gold text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-4">
              RESOURCES
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {isKo ? '자료실' : 'Resources'}
            </h1>
            <p className="text-white/70 text-sm sm:text-base mt-4 max-w-2xl">{t('subtitle')}</p>
          </div>

          {/* Glass card */}
          <div className="w-full opacity-0 animate-[fadeInUp_1.2s_ease-out_0.6s_forwards]">
            <div className="backdrop-blur-md bg-black/50 border border-white/25 rounded-2xl p-6 sm:p-10 shadow-2xl">
              {/* Category menu */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveCat('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeCat === 'all'
                      ? 'bg-gold text-navy'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {isKo ? '전체' : 'All'}
                </button>
                {categoryOrder.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCat(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      activeCat === cat
                        ? 'bg-gold text-navy'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {isKo ? categoryLabels[cat].ko : categoryLabels[cat].en}
                  </button>
                ))}
              </div>

              {/* Auto-scrolling card strip */}
              <div className="relative overflow-hidden">
                <div
                  className="flex gap-5 animate-scroll w-max hover:[animation-play-state:paused]"
                  style={{ animationDuration: '44s' }}
                >
                  {strip.map((r, idx) => renderCard(r, `${r.id}-${idx}`))}
                </div>
                {/* edge fades */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/70 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download request modal */}
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
                  📄 {isKo ? selectedResource.name_ko : selectedResource.name_en}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="dl-name">{t('requestForm.name')} *</Label>
                    <Input
                      id="dl-name"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-company">{t('requestForm.company')}</Label>
                    <Input
                      id="dl-company"
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-email">{t('requestForm.email')} *</Label>
                    <Input
                      id="dl-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dl-phone">{t('requestForm.phone')}</Label>
                    <Input
                      id="dl-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
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
                    <Button type="submit" disabled={status === 'submitting'} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {status === 'submitting'
                        ? isKo
                          ? '처리 중...'
                          : 'Processing...'
                        : t('requestForm.submit')}
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
