"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Stat = {
  id: string
  label_ko: string
  label_en: string
  value: string
  suffix: string
  order_index: number
  is_active: boolean
}

const emptyStat: Omit<Stat, 'id'> = {
  label_ko: '', label_en: '', value: '', suffix: '', order_index: 0, is_active: true,
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [form, setForm] = useState(emptyStat)
  const [saving, setSaving] = useState(false)

  const fetchStats = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('stats').select('*').order('order_index')
    setStats(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchStats() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyStat); setOpen(true) }
  const openEdit = (s: Stat) => { setEditing(s); setForm({ ...s }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('stats').update(form).eq('id', editing.id)
    } else {
      await supabase.from('stats').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchStats()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('통계를 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('stats').delete().eq('id', id)
    fetchStats()
  }

  const f = (k: keyof typeof emptyStat, v: string | number | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">통계 수치 관리</h1>
            <p className="text-sm text-gray-500 mt-1">메인 페이지 통계 섹션의 숫자를 관리합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />통계 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl font-bold text-navy">{stat.value}{stat.suffix}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(stat)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(stat.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{stat.label_ko}</div>
                <div className="text-xs text-gray-400">{stat.label_en}</div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? '통계 수정' : '통계 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {([['label_ko','라벨 (한)'],['label_en','라벨 (영)'],['value','값'],['suffix','단위 (예: +, %)']] as [keyof typeof emptyStat, string][]).map(([key, label]) => (
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
                <input type="checkbox" id="is_active_stat" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_stat">활성</Label>
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
