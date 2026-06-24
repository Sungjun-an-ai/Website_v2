"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import UploadField from '@/components/admin/UploadField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  customer_ko: string
  customer_en: string
  hansung_ko: string
  hansung_en: string
  image_url: string
  name_ko: string
  name_en: string
  tag_ko: string
  tag_en: string
  cta_ko: string
  cta_en: string
  href: string
  order_index: number
  is_active: boolean
}

const empty: Omit<ChatMessage, 'id'> = {
  customer_ko: '', customer_en: '', hansung_ko: '', hansung_en: '', image_url: '',
  name_ko: '', name_en: '', tag_ko: '', tag_en: '', cta_ko: '', cta_en: '',
  href: '/products', order_index: 0, is_active: true,
}

export default function AdminChatMessagesPage() {
  const [items, setItems] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ChatMessage | null>(null)
  const [form, setForm] = useState<Omit<ChatMessage, 'id'>>(empty)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('chat_messages').select('*').order('order_index')
    setItems((data as ChatMessage[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (m: ChatMessage) => { setEditing(m); setForm({ ...empty, ...m }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = editing
      ? await supabase.from('chat_messages').update(form).eq('id', editing.id)
      : await supabase.from('chat_messages').insert(form)
    setSaving(false)
    if (error) alert(`저장 실패: ${error.message || JSON.stringify(error)}`)
    else { setOpen(false); fetchItems() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('메시지를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('chat_messages').delete().eq('id', id)
    fetchItems()
  }

  const f = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">메인 메시지 UI 관리</h1>
            <p className="text-sm text-gray-500 mt-1">메인페이지 대화형 메시지(현장 담당자 / 한성우레탄) 문구를 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />메시지 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['순서', '현장 담당자 (한)', '제품명', '상태', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{m.order_index}</td>
                    <td className="py-3 px-4 text-sm max-w-md truncate">{m.customer_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{m.name_ko}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.is_active ? '활성' : '비활성'}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? '메시지 수정' : '메시지 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1 col-span-2">
                <Label>현장 담당자 질문 (한)</Label>
                <Textarea rows={2} value={form.customer_ko} onChange={e => f('customer_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>현장 담당자 질문 (영)</Label>
                <Textarea rows={2} value={form.customer_en} onChange={e => f('customer_en', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>한성우레탄 답변 (한)</Label>
                <Textarea rows={3} value={form.hansung_ko} onChange={e => f('hansung_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>한성우레탄 답변 (영)</Label>
                <Textarea rows={3} value={form.hansung_en} onChange={e => f('hansung_en', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>제품명 (한)</Label>
                <Input value={form.name_ko} onChange={e => f('name_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>제품명 (영)</Label>
                <Input value={form.name_en} onChange={e => f('name_en', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>태그 (한)</Label>
                <Input value={form.tag_ko} onChange={e => f('tag_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>태그 (영)</Label>
                <Input value={form.tag_en} onChange={e => f('tag_en', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>CTA 버튼 문구 (한)</Label>
                <Input value={form.cta_ko} onChange={e => f('cta_ko', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>CTA 버튼 문구 (영)</Label>
                <Input value={form.cta_en} onChange={e => f('cta_en', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>CTA 링크 (locale 제외)</Label>
                <Input value={form.href} onChange={e => f('href', e.target.value)} placeholder="/products 또는 #contact" />
              </div>
              <div className="col-span-2">
                <UploadField label="제품 이미지" value={form.image_url} onChange={url => f('image_url', url)} bucket="images" folder="chat" />
              </div>
              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_chat" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_chat">활성</Label>
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
