"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type HistoryItem = {
  id: string
  year: number
  month: number | null
  event_ko: string
  event_en: string
  order_index: number
}

const emptyItem: Omit<HistoryItem, 'id'> = {
  year: new Date().getFullYear(),
  month: null,
  event_ko: '',
  event_en: '',
  order_index: 0,
}

export default function AdminHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<HistoryItem | null>(null)
  const [form, setForm] = useState(emptyItem)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('history_items')
      .select('*')
      .order('year', { ascending: false })
      .order('order_index')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyItem); setOpen(true) }
  const openEdit = (item: HistoryItem) => { setEditing(item); setForm({ ...item }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      year: form.year,
      month: form.month,
      event_ko: form.event_ko,
      event_en: form.event_en,
      order_index: form.order_index,
    }
    if (editing) {
      await supabase.from('history_items').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('history_items').insert(payload)
    }
    setSaving(false)
    setOpen(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('연혁 항목을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('history_items').delete().eq('id', id)
    fetchItems()
  }

  const f = <K extends keyof typeof emptyItem>(k: K, v: typeof emptyItem[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const grouped = items.reduce((acc, item) => {
    const decade = Math.floor(item.year / 10) * 10
    if (!acc[decade]) acc[decade] = []
    acc[decade].push(item)
    return acc
  }, {} as Record<number, HistoryItem[]>)
  const decades = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">연혁 관리</h1>
            <p className="text-sm text-gray-500 mt-1">회사 연혁을 추가, 수정, 삭제합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />연혁 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">연혁 항목이 없습니다. 연혁 추가 버튼을 클릭하세요.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {decades.map(decade => (
              <div key={decade}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-navy">{decade}s</h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-2">
                  {grouped[decade].map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-xl font-bold text-navy w-16 flex-shrink-0">{item.year}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.event_ko}</p>
                          {item.event_en && <p className="text-xs text-gray-500 mt-0.5">{item.event_en}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? '연혁 수정' : '연혁 추가'}</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>연도</Label>
                  <Input
                    type="number"
                    value={form.year}
                    onChange={e => f('year', parseInt(e.target.value, 10) || new Date().getFullYear())}
                    min={1900}
                    max={2100}
                  />
                </div>
                <div className="space-y-1">
                  <Label>월 (선택)</Label>
                  <Input
                    type="number"
                    value={form.month ?? ''}
                    onChange={e => f('month', e.target.value ? parseInt(e.target.value, 10) : null)}
                    min={1}
                    max={12}
                    placeholder="1~12"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>내용 (한국어)</Label>
                <Input value={form.event_ko} onChange={e => f('event_ko', e.target.value)} placeholder="연혁 내용을 입력하세요" />
              </div>
              <div className="space-y-1">
                <Label>내용 (영어)</Label>
                <Input value={form.event_en} onChange={e => f('event_en', e.target.value)} placeholder="Enter history event" />
              </div>
              <div className="space-y-1">
                <Label>순서</Label>
                <Input
                  type="number"
                  value={form.order_index}
                  onChange={e => f('order_index', parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
              <Button onClick={handleSave} disabled={saving || !form.event_ko}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
