"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const FONT_OPTIONS = [
  'Pretendard',
  'Noto Sans KR',
  'Noto Serif KR',
  'Nanum Gothic',
  'Nanum Myeongjo',
  'Do Hyeon',
  'Gowun Dodum',
]

const FONT_SIZE_OPTIONS = [
  { label: 'Small (14px)', value: '14' },
  { label: 'Medium (16px)', value: '16' },
  { label: 'Large (18px)', value: '18' },
  { label: 'X-Large (20px)', value: '20' },
]

const ALIGN_OPTIONS = [
  { label: '왼쪽', value: 'left' },
  { label: '가운데', value: 'center' },
  { label: '오른쪽', value: 'right' },
  { label: '양쪽', value: 'justify' },
]

type Settings = {
  font_heading: string
  font_body: string
  font_size_body: string
  font_weight_heading: string
  font_weight_body: string
  text_align_body: string
}

const DEFAULT_SETTINGS: Settings = {
  font_heading: 'Pretendard',
  font_body: 'Pretendard',
  font_size_body: '16',
  font_weight_heading: 'bold',
  font_weight_body: 'normal',
  text_align_body: 'left',
}

export default function AdminTypographyPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value').in('key', Object.keys(DEFAULT_SETTINGS))
    if (data) {
      const map: Partial<Settings> = {}
      data.forEach(row => {
        const key = row.key as string
        if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) {
          map[key as keyof Settings] = row.value
        }
      })
      setSettings(prev => ({ ...prev, ...map }))
    }
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError('')
    const supabase = createClient()
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) {
      setSaveError('저장에 실패했습니다: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const set = (key: keyof Settings, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const PreviewText = () => (
    <div
      style={{
        fontFamily: `'${settings.font_body}', sans-serif`,
        fontSize: `${settings.font_size_body}px`,
        fontWeight: settings.font_weight_body,
        textAlign: settings.text_align_body as 'left' | 'center' | 'right' | 'justify',
      }}
      className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p
        style={{
          fontFamily: `'${settings.font_heading}', sans-serif`,
          fontWeight: settings.font_weight_heading,
        }}
        className="text-xl text-navy mb-2"
      >
        한성우레탄 (Heading)
      </p>
      <p className="text-gray-600">
        BONDING TOMORROW TOGETHER — 36년의 기술력으로 만들어진 최고의 접착 솔루션.
        가나다라마바사아자차카타파하 ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </p>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">글씨체 관리</h1>
          <p className="text-sm text-gray-500 mt-1">폰트, 글씨크기, 굵기, 정렬 등 스타일을 설정합니다</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-6">
            {/* Heading Font */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">제목 폰트</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => set('font_heading', font)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${settings.font_heading === font ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className={`text-sm font-medium ${settings.font_heading === font ? 'text-navy' : 'text-gray-700'}`}>
                      {font}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">굵기</p>
                  <div className="flex gap-2">
                    {['normal', 'bold'].map(w => (
                      <button
                        key={w}
                        onClick={() => set('font_weight_heading', w)}
                        className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${settings.font_weight_heading === w ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        style={{ fontWeight: w }}
                      >
                        {w === 'bold' ? '굵게 (Bold)' : '보통 (Normal)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Font */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">본문 폰트</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => set('font_body', font)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${settings.font_body === font ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className={`text-sm font-medium ${settings.font_body === font ? 'text-navy' : 'text-gray-700'}`}>
                      {font}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Font Size */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">글씨 크기</p>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_SIZE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => set('font_size_body', opt.value)}
                        className={`px-2 py-1.5 rounded-lg text-xs border-2 transition-colors ${settings.font_size_body === opt.value ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">굵기</p>
                  <div className="flex flex-col gap-2">
                    {['normal', 'bold'].map(w => (
                      <button
                        key={w}
                        onClick={() => set('font_weight_body', w)}
                        className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${settings.font_weight_body === w ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        style={{ fontWeight: w }}
                      >
                        {w === 'bold' ? '굵게 (Bold)' : '보통 (Normal)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">텍스트 정렬</p>
                <div className="flex gap-2">
                  {ALIGN_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('text_align_body', opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${settings.text_align_body === opt.value ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-2">미리보기</h2>
              <PreviewText />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '설정 저장'}
              </Button>
              {saved && <span className="text-sm text-green-600">✓ 저장되었습니다</span>}
              {saveError && <span className="text-sm text-red-600">{saveError}</span>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
