"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  slug: string
  name_ko: string
  name_en: string
  description_ko: string
  description_en: string
  category: string
  image_url: string
  order_index: number
  is_active: boolean
}

const emptyProduct: Omit<Product, 'id'> = {
  slug: '', name_ko: '', name_en: '', description_ko: '', description_en: '',
  category: '', image_url: '', order_index: 0, is_active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('products').select('*').order('order_index')
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setOpen(true) }
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      await supabase.from('products').update(form).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(form)
    }
    setSaving(false)
    setOpen(false)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('제품을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const f = (k: keyof typeof emptyProduct, v: string | number | boolean) => setForm(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">제품 관리</h1>
            <p className="text-sm text-gray-500 mt-1">제품 정보를 추가, 수정, 삭제합니다</p>
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
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{product.category}</span></td>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? '제품 수정' : '제품 추가'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              {([['slug','슬러그'],['name_ko','제품명 (한)'],['name_en','제품명 (영)'],['category','카테고리'],['image_url','이미지 URL']] as [keyof typeof emptyProduct, string][]).map(([key, label]) => (
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
