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

const defaultContents: Record<string, string> = {
  privacy_ko: `제1조 (개인정보의 처리 목적)
한성우레탄(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다.

1. 민원사무 처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보

제2조 (개인정보의 처리 및 보유 기간)
① 회사는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 민원사무 처리: 3년

제3조 (처리하는 개인정보의 항목)
- 필수항목: 이름, 연락처, 이메일 주소
- 선택항목: 회사명, 문의 내용

제4조 (개인정보의 제3자 제공)
회사는 정보주체의 동의, 법률의 특별한 규정 등의 경우에만 제3자에게 제공합니다.

제5조 (정보주체의 권리)
정보주체는 언제든지 열람요구, 정정 요구, 삭제요구, 처리정지 요구를 할 수 있습니다.

제6조 (개인정보 보호책임자)
- 담당부서: 관리팀
- 연락처: info@hsurethane.co.kr

본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.`,

  privacy_en: `Article 1 (Purpose of Processing Personal Information)
Hansung Urethane processes personal information for the following purposes:
1. Handling Civil Complaints: Verifying identity, confirming complaints, notifying results.

Article 2 (Retention Period)
Civil Complaints: 3 years

Article 3 (Items Processed)
- Required: Name, contact number, email address
- Optional: Company name, inquiry content

Article 4 (Third Party Provision)
Personal information is provided to third parties only with consent or as required by law.

Article 5 (Rights of Data Subjects)
Data subjects may request access, correction, deletion, or suspension of processing at any time.

Article 6 (Privacy Officer)
- Department: Management Team
- Contact: info@hsurethane.co.kr

This Privacy Policy is effective from January 1, 2024.`,

  terms_ko: `제1조 (목적)
이 약관은 한성우레탄(이하 "회사")이 제공하는 인터넷 서비스의 이용과 관련한 권리, 의무 및 책임사항을 규정합니다.

제2조 (용어의 정의)
1. "서비스"란 회사가 제공하는 모든 인터넷 서비스를 말합니다.
2. "이용자"란 이 약관에 따라 서비스를 이용하는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 이 약관은 모든 이용자에 대하여 효력을 발생합니다.
② 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 공지합니다.

제4조 (서비스의 제공)
- 제품 정보 제공
- 문의 접수 서비스

제5조 (이용자의 의무)
허위정보 등록, 타인의 정보 도용, 저작권 침해 등의 행위를 금지합니다.

제6조 (면책조항)
천재지변 등 불가항력으로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.

제7조 (준거법 및 관할법원)
대한민국 법률을 적용하며, 분쟁은 회사 본사 소재지 관할 법원에서 처리합니다.

본 이용약관은 2024년 1월 1일부터 적용됩니다.`,

  terms_en: `Article 1 (Purpose)
These Terms of Service govern the rights, obligations, and responsibilities between Hansung Urethane and users.

Article 2 (Definitions)
1. "Service" refers to all internet services provided by the Company.
2. "User" refers to anyone using the Service under these Terms.

Article 3 (Effectiveness and Amendment)
① These Terms are effective for all users.
② The Company may amend these Terms and will notify users via the Service.

Article 4 (Services Provided)
- Product information
- Inquiry reception service

Article 5 (User Obligations)
Users must not register false information, steal others' information, or infringe intellectual property rights.

Article 6 (Disclaimer)
The Company is not liable for service disruptions due to force majeure or user fault.

Article 7 (Governing Law)
Korean law applies; disputes are under the jurisdiction of the court at the Company's headquarters.

These Terms of Service are effective from January 1, 2024.`,
}

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
    const map: Record<string, string> = { ...defaultContents }
    if (data) {
      for (const row of data) {
        if (row.content) {
          map[`${row.type}_${row.locale}`] = row.content
        }
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

  const handleReset = () => {
    if (!confirm('기본 내용으로 초기화하시겠습니까? 현재 내용이 지워집니다.')) return
    setContents(prev => ({ ...prev, [key]: defaultContents[key] || '' }))
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">법적고지 관리</h1>
          <p className="text-sm text-gray-500 mt-1">개인정보처리방침 및 이용약관을 편집합니다. 저장된 내용이 웹사이트에 그대로 표출됩니다.</p>
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
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>웹사이트 표출 내용과 동일하게 관리됩니다. 빈 경우 기본 내용이 표시됩니다.</span>
              <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 underline text-xs">
                기본 내용으로 초기화
              </button>
            </div>
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
