"use client"

import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const SETTING_KEYS = ['header_logo_url', 'header_bg_color', 'favicon_url'] as const
type SettingKey = typeof SETTING_KEYS[number]

const DEFAULTS: Record<SettingKey, string> = {
  header_logo_url: '',
  header_bg_color: '#ffffff',
  favicon_url: '',
}

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<Record<SettingKey, string>>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)

  const fetchSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [...SETTING_KEYS])
    const map = { ...DEFAULTS }
    if (data) {
      data.forEach(row => {
        if (SETTING_KEYS.includes(row.key as SettingKey)) {
          map[row.key as SettingKey] = row.value
        }
      })
    }
    setSettings(map)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const rows = SETTING_KEYS.map(key => ({ key, value: settings[key] }))
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' })
    setSaving(false)
    setMessage(error ? `오류: ${error.message}` : '✓ 저장되었습니다.')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const ALLOWED_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'ico', 'gif']
      const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon']
      const rawExt = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : ''
      if (!rawExt || !ALLOWED_EXTS.includes(rawExt)) {
        throw new Error(`지원하지 않는 파일 형식입니다. (${ALLOWED_EXTS.join(', ')})`)
      }
      if (!ALLOWED_MIMES.includes(file.type)) {
        throw new Error('파일 MIME 타입이 허용되지 않습니다.')
      }
      const supabase = createClient()
      const path = `branding/logo.${rawExt}`
      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: true })
      if (uploadErr) throw new Error(uploadErr.message)
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
      setSettings(prev => ({
        ...prev,
        header_logo_url: publicUrl,
        favicon_url: publicUrl,
      }))
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '업로드 오류')
    }
    setUploading(false)
  }

  const set = (key: SettingKey, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">브랜딩 관리</h1>
          <p className="text-sm text-gray-500 mt-1">상단 로고, 배경색상, 파비콘을 관리합니다</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="space-y-6">
            {/* Logo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">상단 로고</h2>
              <div className="space-y-4">
                {settings.header_logo_url && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.header_logo_url}
                      alt="로고 미리보기"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label>로고 URL (직접 입력)</Label>
                  <Input
                    value={settings.header_logo_url}
                    onChange={e => set('header_logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? '업로드 중...' : '파일 업로드'}
                  </Button>
                  <span className="text-xs text-gray-400">
                    PNG, SVG, JPG 지원 · 로고 업로드 시 파비콘도 자동 변경
                  </span>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
                {uploadError && (
                  <p className="text-xs text-red-500">{uploadError}</p>
                )}
              </div>
            </div>

            {/* Favicon */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">파비콘 URL</h2>
              <div className="space-y-1">
                <Label>파비콘 URL</Label>
                <Input
                  value={settings.favicon_url}
                  onChange={e => set('favicon_url', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-xs text-gray-400 mt-1">로고 업로드 시 자동으로 파비콘도 같은 이미지로 설정됩니다.</p>
              </div>
            </div>

            {/* Header Background Color */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">헤더 배경색상</h2>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.header_bg_color}
                  onChange={e => set('header_bg_color', e.target.value)}
                  className="h-10 w-20 rounded border border-gray-200 cursor-pointer"
                />
                <Input
                  value={settings.header_bg_color}
                  onChange={e => set('header_bg_color', e.target.value)}
                  className="w-40"
                  placeholder="#ffffff"
                />
                <div
                  className="h-10 w-24 rounded border border-gray-200"
                  style={{ backgroundColor: settings.header_bg_color }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                스크롤 후 헤더 배경색상에 적용됩니다.
              </p>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">미리보기</h2>
              <div
                className="rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                style={{ backgroundColor: settings.header_bg_color }}
              >
                {settings.header_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.header_logo_url} alt="로고" className="h-12 object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                    로고
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-navy">한성우레탄</div>
                  <div className="text-xs text-gray-500">BONDING TOMORROW TOGETHER</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '설정 저장'}
              </Button>
              {message && (
                <span className={`text-sm ${message.startsWith('오류') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
