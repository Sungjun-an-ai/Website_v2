"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import UploadField from '@/components/admin/UploadField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Category = {
  id: string
  slug: string
  name_ko: string
  name_en: string
  subtitle_ko: string
  subtitle_en: string
  hero_image_url: string
  is_video: boolean
  href: string
  placeholder: string
  order_index: number
  is_active: boolean
}

const emptyCategory: Omit<Category, 'id'> = {
  slug: '', name_ko: '', name_en: '', subtitle_ko: '', subtitle_en: '',
  hero_image_url: '', is_video: false, href: '', placeholder: 'linear-gradient(135deg, #1A2B6B, #0D1220)',
  order_index: 0, is_active: true,
}

export default function AdminProductCategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<Omit<Category, 'id'>>(emptyCategory)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('product_categories').select('*').order('order_index')
    setItems((data as Category[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyCategory); setOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setForm({ ...emptyCategory, ...c }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, is_video: form.hero_image_url ? form.hero_image_url.endsWith('.mp4') : form.is_video }
    const { error } = editing
      ? await supabase.from('product_categories').update(payload).eq('id', editing.id)
      : await supabase.from('product_categories').insert(payload)
    setSaving(false)
    if (error) {
      alert(`저장 실패: ${error.message || JSON.stringify(error)}`)
    } else {
      setOpen(false)
      fetchItems()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('카테고리를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('product_categories').delete().eq('id', id)
    fetchItems()
  }

  const f = <K extends keyof typeof emptyCategory>(k: K, v: (typeof emptyCategory)[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">제품군 카테고리 관리</h1>
            <p className="text-sm text-gray-500 mt-1">메인페이지 제품군 패널의 카테고리명, 서브타이틀, 배경 히어로 이미지를 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />카테고리 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['순서', '카테고리명 (한)', '카테고리명 (영)', '링크', '상태', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{c.order_index}</td>
                    <td className="py-3 px-4 text-sm font-medium">{c.name_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{c.name_en}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">{c.href}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? '활성' : '비활성'}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? '카테고리 수정' : '카테고리 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <Label>슬러그</Label>
                <Input value={form.slug} onChange={e => f('slug', e.target.value)} placeholder="sealant" />
              </div>
              <div className="space-y-1">
                <Label>링크 (locale 제외)</Label>
                <Input value={form.href} onChange={e => f('href', e.target.value)} placeholder="/products/ws-3000" />
              </div>
              <div className="space-y-1">
                <Label>카테고리명 (한)</Label>
                <Input value={form.name_ko} onChange={e => f('name_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>카테고리명 (영)</Label>
                <Input value={form.name_en} onChange={e => f('name_en', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>서브타이틀 (한)</Label>
                <Input value={form.subtitle_ko} onChange={e => f('subtitle_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>서브타이틀 (영)</Label>
                <Input value={form.subtitle_en} onChange={e => f('subtitle_en', e.target.value)} />
              </div>
              <div className="col-span-2">
                <UploadField
                  label="배경 히어로 이미지/영상 (mp4 가능)"
                  value={form.hero_image_url}
                  onChange={url => f('hero_image_url', url)}
                  bucket="media"
                  folder="categories"
                  accept="image/*,video/mp4"
                  preview
                />
                <p className="text-xs text-gray-400 mt-1">.mp4 파일이면 자동으로 영상으로 표시됩니다.</p>
              </div>
              <div className="space-y-1 col-span-2">
                <Label>배경 그라데이션 (CSS)</Label>
                <Input value={form.placeholder} onChange={e => f('placeholder', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_cat" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_cat">활성</Label>
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
