"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type TrackRecord = {
  id: string
  client_name_ko: string
  client_name_en: string
  project_ko: string
  project_en: string
  year: number
  category: string
  order_index: number
}

const CATEGORIES = ['construction', 'civil', 'industrial', 'other']
const CATEGORY_LABELS: Record<string, string> = {
  construction: '건설',
  civil: '토목',
  industrial: '산업',
  other: '기타',
}

const emptyRecord: Omit<TrackRecord, 'id'> = {
  client_name_ko: '',
  client_name_en: '',
  project_ko: '',
  project_en: '',
  year: new Date().getFullYear(),
  category: 'construction',
  order_index: 0,
}

export default function AdminTrackRecordsPage() {
  const [records, setRecords] = useState<TrackRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TrackRecord | null>(null)
  const [form, setForm] = useState(emptyRecord)
  const [saving, setSaving] = useState(false)

  const fetchRecords = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('track_records')
      .select('*')
      .order('year', { ascending: false })
      .order('order_index')
    setRecords(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchRecords() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyRecord); setOpen(true) }
  const openEdit = (r: TrackRecord) => { setEditing(r); setForm({ ...r }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('track_records').update(form).eq('id', editing.id)
    } else {
      await supabase.from('track_records').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchRecords()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('납품실적을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('track_records').delete().eq('id', id)
    fetchRecords()
  }

  const f = <K extends keyof typeof emptyRecord>(k: K, v: typeof emptyRecord[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const categoryColors: Record<string, string> = {
    construction: 'bg-blue-100 text-blue-700',
    civil: 'bg-green-100 text-green-700',
    industrial: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700',
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">납품실적 관리</h1>
            <p className="text-sm text-gray-500 mt-1">납품 및 시공 실적을 추가, 수정, 삭제합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />실적 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">납품실적이 없습니다. 실적 추가 버튼을 클릭하세요.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['연도', '발주처', '프로젝트', '분야', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-navy">{record.year}</td>
                    <td className="py-3 px-4 text-sm font-medium">{record.client_name_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{record.project_ko}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[record.category] || 'bg-gray-100 text-gray-700'}`}>
                        {CATEGORY_LABELS[record.category] || record.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(record)}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(record.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
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
            <DialogHeader><DialogTitle>{editing ? '실적 수정' : '실적 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <Label>연도</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={e => f('year', parseInt(e.target.value, 10) || new Date().getFullYear())}
                />
              </div>
              <div className="space-y-1">
                <Label>분야</Label>
                <select
                  value={form.category}
                  onChange={e => f('category', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>발주처 (한국어)</Label>
                <Input value={form.client_name_ko} onChange={e => f('client_name_ko', e.target.value)} placeholder="발주처명" />
              </div>
              <div className="space-y-1">
                <Label>발주처 (영어)</Label>
                <Input value={form.client_name_en} onChange={e => f('client_name_en', e.target.value)} placeholder="Client Name" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>프로젝트명 (한국어)</Label>
                <Input value={form.project_ko} onChange={e => f('project_ko', e.target.value)} placeholder="프로젝트명을 입력하세요" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>프로젝트명 (영어)</Label>
                <Input value={form.project_en} onChange={e => f('project_en', e.target.value)} placeholder="Enter project name" />
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
              <Button onClick={handleSave} disabled={saving || !form.client_name_ko || !form.project_ko}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
