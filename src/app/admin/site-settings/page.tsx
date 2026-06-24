"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Stat = { value: string; label_ko: string; label_en: string }

const CONTACT_KEYS = [
  ['contact_address_ko', '주소 (한)'],
  ['contact_address_en', '주소 (영)'],
  ['contact_phone', '전화 (한)'],
  ['contact_phone_en', '전화 (영)'],
  ['contact_fax', '팩스 (한)'],
  ['contact_fax_en', '팩스 (영)'],
  ['contact_email', '이메일'],
  ['contact_hours_ko', '운영시간 (한)'],
  ['contact_hours_en', '운영시간 (영)'],
] as const

export default function AdminSiteSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const fetchAll = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    for (const r of data ?? []) map[r.key] = r.value
    setValues(map)
    try {
      const parsed = map.track_record_stats ? JSON.parse(map.track_record_stats) : []
      setStats(Array.isArray(parsed) ? parsed : [])
    } catch {
      setStats([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const setVal = (k: string, v: string) => setValues(p => ({ ...p, [k]: v }))
  const setStat = (i: number, k: keyof Stat, v: string) =>
    setStats(p => p.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)))
  const addStat = () => setStats(p => [...p, { value: '', label_ko: '', label_en: '' }])
  const removeStat = (i: number) => setStats(p => p.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const rows = [
      ...CONTACT_KEYS.map(([key]) => ({ key, value: values[key] ?? '' })),
      { key: 'track_record_stats', value: JSON.stringify(stats) },
    ]
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
            <h1 className="text-2xl font-bold text-gray-900">연락처 · 푸터 · 카운터 관리</h1>
            <p className="text-sm text-gray-500 mt-1">푸터와 문의 섹션의 연락처 정보, 납품실적 카운터 수치를 관리합니다</p>
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
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보 (푸터 / 문의 섹션 공통)</h2>
              <div className="grid grid-cols-2 gap-4">
                {CONTACT_KEYS.map(([key, label]) => (
                  <div key={key} className={`space-y-1 ${key.startsWith('contact_address') ? 'col-span-2' : ''}`}>
                    <Label>{label}</Label>
                    <Input value={values[key] ?? ''} onChange={e => setVal(key, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">납품실적 카운터</h2>
                <Button variant="outline" size="sm" onClick={addStat}><Plus className="h-4 w-4 mr-1" />항목 추가</Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-xs font-semibold text-gray-500 px-1">
                  <span>수치 (예: 500+)</span><span>라벨 (한)</span><span>라벨 (영)</span><span></span>
                </div>
                {stats.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
                    <Input value={s.value} onChange={e => setStat(i, 'value', e.target.value)} />
                    <Input value={s.label_ko} onChange={e => setStat(i, 'label_ko', e.target.value)} />
                    <Input value={s.label_en} onChange={e => setStat(i, 'label_en', e.target.value)} />
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeStat(i)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                  </div>
                ))}
                {stats.length === 0 && <p className="text-sm text-gray-400">항목이 없습니다. '항목 추가'를 눌러 카운터를 추가하세요.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
