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

type Product = {
  id: string
  slug: string
  name_ko: string
  name_en: string
  tag_ko: string
  tag_en: string
  subtitle_ko: string
  subtitle_en: string
  description_ko: string
  description_en: string
  category: string
  image_url: string
  features_ko: string[]
  features_en: string[]
  applications_ko: string[]
  applications_en: string[]
  specs: { item: string; method: string; result: string }[]
  related_resources: { labelKo: string; labelEn: string; href: string }[]
  order_index: number
  is_active: boolean
}

const emptyProduct: Omit<Product, 'id'> = {
  slug: '', name_ko: '', name_en: '', tag_ko: '', tag_en: '',
  subtitle_ko: '', subtitle_en: '', description_ko: '', description_en: '',
  category: 'sealant', image_url: '',
  features_ko: [], features_en: [], applications_ko: [], applications_en: [],
  specs: [], related_resources: [],
  order_index: 0, is_active: true,
}

const categoryOptions: { value: string; label: string }[] = [
  { value: 'sealant', label: '지수제' },
  { value: 'fire-door-adhesive', label: '방화문 접착제' },
  { value: 'general-adhesive', label: '일반 접착제' },
  { value: 'interior-door-adhesive', label: '실내도어 접착제' },
]

const linesToArr = (s: string) => s.split('\n').map(v => v.trim()).filter(Boolean)
const arrToLines = (a: string[]) => (a || []).join('\n')

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct)
  const [specsText, setSpecsText] = useState('[]')
  const [resourcesText, setResourcesText] = useState('[]')
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('products').select('*').order('order_index')
    setProducts((data as Product[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const loadForm = (p: Omit<Product, 'id'>) => {
    setForm(p)
    setSpecsText(JSON.stringify(p.specs ?? [], null, 2))
    setResourcesText(JSON.stringify(p.related_resources ?? [], null, 2))
  }

  const openAdd = () => { setEditing(null); loadForm(emptyProduct); setOpen(true) }
  const openEdit = (p: Product) => {
    setEditing(p)
    loadForm({ ...emptyProduct, ...p })
    setOpen(true)
  }

  const handleSave = async () => {
    let specs: Product['specs'] = []
    let related_resources: Product['related_resources'] = []
    try {
      specs = JSON.parse(specsText || '[]')
      related_resources = JSON.parse(resourcesText || '[]')
    } catch {
      alert('시험규격(Specs) 또는 관련자료(Resources)의 JSON 형식이 올바르지 않습니다.')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = { ...form, specs, related_resources }
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (error) {
      alert(`저장 실패: ${error.message || JSON.stringify(error)}`)
    } else {
      setOpen(false)
      fetchProducts()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('제품을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const f = <K extends keyof typeof emptyProduct>(k: K, v: (typeof emptyProduct)[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">제품 관리</h1>
            <p className="text-sm text-gray-500 mt-1">제품 상세페이지 내용을 추가, 수정, 삭제합니다</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />제품 추가</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['슬러그', '제품명 (한)', '제품명 (영)', '카테고리', '상태', '작업'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">{product.slug}</td>
                    <td className="py-3 px-4 text-sm font-medium">{product.name_ko}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.name_en}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{categoryOptions.find(c => c.value === product.category)?.label || product.category}</span></td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.is_active ? '활성' : '비활성'}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}><Edit className="h-4 w-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '제품 수정' : '제품 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <Label>슬러그 (URL)</Label>
                <Input value={form.slug} onChange={e => f('slug', e.target.value)} placeholder="ws-3000" />
              </div>
              <div className="space-y-1">
                <Label>카테고리</Label>
                <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={form.category} onChange={e => f('category', e.target.value)}>
                  {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
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
                <Input value={form.tag_ko} onChange={e => f('tag_ko', e.target.value)} placeholder="반경질" />
              </div>
              <div className="space-y-1">
                <Label>태그 (영)</Label>
                <Input value={form.tag_en} onChange={e => f('tag_en', e.target.value)} placeholder="Semi-Rigid" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>서브타이틀 (한)</Label>
                <Input value={form.subtitle_ko} onChange={e => f('subtitle_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>서브타이틀 (영)</Label>
                <Input value={form.subtitle_en} onChange={e => f('subtitle_en', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>본문 설명 (한)</Label>
                <Textarea rows={3} value={form.description_ko} onChange={e => f('description_ko', e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>본문 설명 (영)</Label>
                <Textarea rows={3} value={form.description_en} onChange={e => f('description_en', e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label>핵심 특성 (한) — 한 줄에 하나</Label>
                <Textarea rows={4} value={arrToLines(form.features_ko)} onChange={e => f('features_ko', linesToArr(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>핵심 특성 (영) — 한 줄에 하나</Label>
                <Textarea rows={4} value={arrToLines(form.features_en)} onChange={e => f('features_en', linesToArr(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>적용 분야 (한) — 한 줄에 하나</Label>
                <Textarea rows={4} value={arrToLines(form.applications_ko)} onChange={e => f('applications_ko', linesToArr(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>적용 분야 (영) — 한 줄에 하나</Label>
                <Textarea rows={4} value={arrToLines(form.applications_en)} onChange={e => f('applications_en', linesToArr(e.target.value))} />
              </div>

              <div className="space-y-1 col-span-2">
                <Label>시험 규격 하이라이트 (JSON: item / method / result)</Label>
                <Textarea rows={6} className="font-mono text-xs" value={specsText} onChange={e => setSpecsText(e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>관련 자료 (JSON: labelKo / labelEn / href)</Label>
                <Textarea rows={4} className="font-mono text-xs" value={resourcesText} onChange={e => setResourcesText(e.target.value)} />
              </div>

              <div className="col-span-2">
                <UploadField label="대표 이미지" value={form.image_url} onChange={url => f('image_url', url)} bucket="images" folder="products" />
              </div>

              <div className="space-y-1">
                <Label>순서</Label>
                <Input type="number" value={form.order_index} onChange={e => f('order_index', parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-1 flex items-center gap-2 pt-5">
                <input type="checkbox" id="is_active_prod" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="is_active_prod">활성</Label>
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
