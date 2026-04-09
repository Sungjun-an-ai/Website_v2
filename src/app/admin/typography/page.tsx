"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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

export default function AdminTypographyPage() {
  const [headingFont, setHeadingFont] = useState('Pretendard')
  const [bodyFont, setBodyFont] = useState('Pretendard')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value').in('key', ['font_heading', 'font_body'])
    if (data) {
      data.forEach(row => {
        if (row.key === 'font_heading') setHeadingFont(row.value)
        if (row.key === 'font_body') setBodyFont(row.value)
      })
    }
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    await supabase.from('site_settings').upsert([
      { key: 'font_heading', value: headingFont },
      { key: 'font_body', value: bodyFont },
    ], { onConflict: 'key' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const PreviewText = ({ font }: { font: string }) => (
    <div
      style={{ fontFamily: `'${font}', sans-serif` }}
      className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p className="text-lg font-bold text-navy">한성우레탄</p>
      <p className="text-sm text-gray-600">BONDING TOMORROW TOGETHER</p>
      <p className="text-xs text-gray-400 mt-1">가나다라마바사아자차카타파하 ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">글씨체 관리</h1>
          <p className="text-sm text-gray-500 mt-1">프론트엔드에서 사용할 폰트를 설정합니다</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">제목 폰트</h2>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => setHeadingFont(font)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${headingFont === font ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className={`text-sm font-medium ${headingFont === font ? 'text-navy' : 'text-gray-700'}`}>{font}</span>
                  </button>
                ))}
              </div>
              <PreviewText font={headingFont} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">본문 폰트</h2>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => setBodyFont(font)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${bodyFont === font ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className={`text-sm font-medium ${bodyFont === font ? 'text-navy' : 'text-gray-700'}`}>{font}</span>
                  </button>
                ))}
              </div>
              <PreviewText font={bodyFont} />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '설정 저장'}
              </Button>
              {saved && <span className="text-sm text-green-600">✓ 저장되었습니다</span>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
