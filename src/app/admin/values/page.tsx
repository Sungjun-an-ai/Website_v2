"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type CoreValue = {
  id: string
  title_ko: string
  title_en: string
  description_ko: string
  description_en: string
  icon: string
  order_index: number
  is_active: boolean
}

const emptyValue: Omit<CoreValue, 'id'> = {
  title_ko: '', title_en: '', description_ko: '', description_en: '',
  icon: 'star', order_index: 0, is_active: true,
}

export default function AdminValuesPage() {
  const [values, setValues] = useState<CoreValue[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CoreValue | null>(null)
  const [form, setForm] = useState(emptyValue)
  const [saving, setSaving] = useState(false)

  const fetchValues = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('core_values').select('*').order('order_index')
    setValues(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchValues() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyValue); setOpen(true) }
  const openEdit = (v: CoreValue) => { setEditing(v); setForm({ ...v }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('core_values').update(form).eq('id', editing.id)
    } else {
      await supabase.from('core_values').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchValues()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('핵심 가치를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('core_values').delete().eq('id', id)
    fetchValues()
  }

  const f = (k: keyof typeof emptyValue, v: string | number | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">핵심 가치 관리</h1>
            <p className="text-sm text-gray-500 mt-1">회사 핵심 가치 섹션을 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />가치 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map(val => (
              <div key={val.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-bold text-navy/20">0{val.order_index}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(val)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(val.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                  </div>
                </div>
                <h3 className="font-semibold text-navy">{val.title_ko}</h3>
                <p className="text-sm text-gray-500 mt-1">{val.title_en}</p>
                {val.description_ko && <p className="text-xs text-gray-400 mt-2">{val.description_ko}</p>}
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '핵심 가치 수정' : '핵심 가치 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {([['title_ko','제목 (한)'],['title_en','제목 (영)'],['icon','아이콘']] as [keyof typeof emptyValue, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Input value={form[key] as string} onChange={e => f(key, e.target.value)} />
                </div>
              ))}
              <div className="space-y-1 col-span-2">
                <Label>설명 (한)</Label>
                <Input value={form.description_ko} onChange={e => f('description_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>설명 (영)</Label>
                <Input value={form.description_en} onChange={e => f('description_en', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value))} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_val" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_val">활성</Label>
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
