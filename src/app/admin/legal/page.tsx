"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

type Tab = { type: 'privacy' | 'terms'; locale: 'ko' | 'en'; label: string }

const tabs: Tab[] = [
  { type: 'privacy', locale: 'ko', label: '개인정보처리방침 (KO)' },
  { type: 'privacy', locale: 'en', label: '개인정보처리방침 (EN)' },
  { type: 'terms', locale: 'ko', label: '이용약관 (KO)' },
  { type: 'terms', locale: 'en', label: '이용약관 (EN)' },
]

export default function AdminLegalPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [contents, setContents] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('legal_pages').select('type, locale, content')
    const map: Record<string, string> = {}
    if (data) {
      for (const row of data) {
        map[`${row.type}_${row.locale}`] = row.content
      }
    }
    setContents(map)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const current = tabs[activeTab]
  const key = `${current.type}_${current.locale}`

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.from('legal_pages').upsert(
      { type: current.type, locale: current.locale, content: contents[key] || '', updated_at: new Date().toISOString() },
      { onConflict: 'type,locale' }
    )
    setSaving(false)
    setMessage(error ? `오류: ${error.message}` : '저장되었습니다.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">법적고지 관리</h1>
          <p className="text-sm text-gray-500 mt-1">개인정보처리방침 및 이용약관을 편집합니다</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveTab(idx); setMessage('') }}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === idx
                  ? 'bg-white border border-b-white border-gray-200 text-navy -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={contents[key] || ''}
              onChange={e => setContents(prev => ({ ...prev, [key]: e.target.value }))}
              className="min-h-[500px] font-mono text-sm"
              placeholder={`${current.label} 내용을 입력하세요...`}
            />
            <div className="flex items-center justify-between">
              {message && (
                <p className={`text-sm ${message.startsWith('오류') ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
              <div className="ml-auto">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
