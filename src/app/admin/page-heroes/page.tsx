"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UploadField from '@/components/admin/UploadField'
import { createClient } from '@/lib/supabase/client'

type SectionDef = {
  key: 'history' | 'track_record' | 'notice' | 'resources'
  label: string
  hint: string
}

const SECTIONS: SectionDef[] = [
  { key: 'history', label: '연혁', hint: '회사 소개 > 연혁 페이지 상단' },
  { key: 'track_record', label: '납품실적', hint: '회사 소개 > 납품실적 페이지 상단' },
  { key: 'notice', label: '공지사항', hint: '공지사항 페이지 상단' },
  { key: 'resources', label: '자료실', hint: '자료실 페이지 상단' },
]

function heroKeys(section: SectionDef['key']) {
  return {
    titleKo: `${section}_hero_title_ko`,
    titleEn: `${section}_hero_title_en`,
    subtitleKo: `${section}_hero_subtitle_ko`,
    subtitleEn: `${section}_hero_subtitle_en`,
    imageUrl: `${section}_hero_image_url`,
  }
}

const ALL_KEYS = SECTIONS.flatMap((s) => Object.values(heroKeys(s.key)))

export default function AdminPageHeroesPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const fetchAll = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value').in('key', ALL_KEYS)
    const map: Record<string, string> = {}
    for (const r of data ?? []) map[r.key] = r.value
    setValues(map)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const setVal = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const rows = ALL_KEYS.map((key) => ({ key, value: values[key] ?? '' }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) alert(`저장 실패: ${error.message || JSON.stringify(error)}`)
    else setSavedAt(new Date().toLocaleTimeString('ko-KR'))
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">페이지 히어로 관리</h1>
            <p className="text-sm text-gray-500 mt-1">연혁·납품실적·공지사항·자료실 페이지 상단의 히어로 이미지/영상, 제목, 부제목을 관리합니다</p>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && <span className="text-xs text-green-600">{savedAt} 저장됨</span>}
            <Button onClick={handleSave} disabled={saving || loading}>{saving ? '저장 중...' : '전체 저장'}</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-8">
            {SECTIONS.map((section) => {
              const k = heroKeys(section.key)
              return (
                <section key={section.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{section.label}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{section.hint}</p>
                  </div>

                  <div className="space-y-4">
                    <UploadField
                      label="히어로 이미지 / 영상"
                      value={values[k.imageUrl] ?? ''}
                      onChange={(v) => setVal(k.imageUrl, v)}
                      folder={`hero/${section.key}`}
                      accept="image/*,video/*"
                    />
                    <p className="text-xs text-gray-400 -mt-2">이미지(jpg/png/webp) 또는 영상(mp4/webm)을 업로드할 수 있습니다. 비워두면 기본 영상이 표시됩니다.</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>제목 (한)</Label>
                        <Input value={values[k.titleKo] ?? ''} onChange={(e) => setVal(k.titleKo, e.target.value)} placeholder="비워두면 기본 제목" />
                      </div>
                      <div className="space-y-1">
                        <Label>제목 (영)</Label>
                        <Input value={values[k.titleEn] ?? ''} onChange={(e) => setVal(k.titleEn, e.target.value)} placeholder="비워두면 기본 제목" />
                      </div>
                      <div className="space-y-1">
                        <Label>부제목 (한)</Label>
                        <textarea
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[64px]"
                          value={values[k.subtitleKo] ?? ''}
                          onChange={(e) => setVal(k.subtitleKo, e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>부제목 (영)</Label>
                        <textarea
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[64px]"
                          value={values[k.subtitleEn] ?? ''}
                          onChange={(e) => setVal(k.subtitleEn, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
