"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type HeroSlide = {
  id: string
  title_ko: string
  title_en: string
  subtitle_ko: string
  subtitle_en: string
  image_url: string
  cta_text_ko: string
  cta_text_en: string
  cta_href: string
  order_index: number
  is_active: boolean
}

const emptySlide: Omit<HeroSlide, 'id'> = {
  title_ko: '', title_en: '', subtitle_ko: '', subtitle_en: '',
  image_url: '', cta_text_ko: '더 보기', cta_text_en: 'Learn More',
  cta_href: '/', order_index: 0, is_active: true,
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState(emptySlide)
  const [saving, setSaving] = useState(false)

  const fetchSlides = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('hero_slides').select('*').order('order_index')
    setSlides(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSlides() }, [])

  const openAdd = () => { setEditing(null); setForm(emptySlide); setOpen(true) }
  const openEdit = (slide: HeroSlide) => { setEditing(slide); setForm({ ...slide }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('hero_slides').update(form).eq('id', editing.id)
    } else {
      await supabase.from('hero_slides').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchSlides()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('슬라이드를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('hero_slides').delete().eq('id', id)
    fetchSlides()
  }

  const toggleActive = async (slide: HeroSlide) => {
    const supabase = createClient()
    await supabase.from('hero_slides').update({ is_active: !slide.is_active }).eq('id', slide.id)
    fetchSlides()
  }

  const f = (k: keyof typeof emptySlide, v: string | number | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">히어로 슬라이드 관리</h1>
            <p className="text-sm text-gray-500 mt-1">메인 페이지 히어로 캐러셀 슬라이드를 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />슬라이드 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['순서', '제목 (한국어)', '제목 (영어)', '상태', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slides.map(slide => (
                  <tr key={slide.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{slide.order_index}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{slide.title_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{slide.title_en}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleActive(slide)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {slide.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {slide.is_active ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(slide)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(slide.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? '슬라이드 수정' : '슬라이드 추가'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {([['title_ko','제목 (한)'],['title_en','제목 (영)'],['subtitle_ko','부제목 (한)'],['subtitle_en','부제목 (영)'],['image_url','이미지 URL'],['cta_text_ko','버튼 텍스트 (한)'],['cta_text_en','버튼 텍스트 (영)'],['cta_href','버튼 링크']] as [keyof typeof emptySlide, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_hero" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_hero">활성</Label>
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
