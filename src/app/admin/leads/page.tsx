"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Download, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { csvExport } from '@/lib/utils'

type Lead = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  product_interest: string
  message: string
  status: string
  locale: string
  created_at: string
}

const statusMap: Record<string, { label: string; className: string }> = {
  new: { label: '신규', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: '연락완료', className: 'bg-yellow-100 text-yellow-700' },
  closed: { label: '종결', className: 'bg-green-100 text-green-700' },
}

const filterLabels = ['전체', '신규', '연락완료', '종결']
const filterValues = ['all', 'new', 'contacted', 'closed']

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchLeads = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [])

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  const handleExport = () => {
    csvExport(leads.map(lead => ({
      '이름/Name': lead.name, '회사/Company': lead.company, '이메일/Email': lead.email,
      '전화/Phone': lead.phone, '관심제품/Product': lead.product_interest,
      '문의내용/Message': lead.message, '상태/Status': lead.status,
      '언어/Locale': lead.locale, '등록일/Created': lead.created_at,
    })), '문의목록_Leads')
  }

  const openDetail = (lead: Lead) => { setSelected(lead); setDetailOpen(true) }

  const handleStatusChange = async (status: string) => {
    if (!selected) return
    setUpdatingStatus(true)
    const supabase = createClient()
    await supabase.from('leads').update({ status }).eq('id', selected.id)
    setUpdatingStatus(false)
    setSelected(prev => prev ? { ...prev, status } : null)
    fetchLeads()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
            <p className="text-sm text-gray-500 mt-1">고객 문의를 확인하고 관리합니다</p>
          </div>
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />CSV 내보내기</Button>
        </div>

        <div className="flex gap-2 mb-4">
          {filterLabels.map((label, i) => (
            <button key={label} onClick={() => setFilter(filterValues[i])} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === filterValues[i] ? 'bg-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['이름', '회사', '이메일', '관심제품', '등록일', '상태', '상세'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.company}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{lead.product_interest}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{new Date(lead.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[lead.status]?.className || 'bg-gray-100 text-gray-500'}`}>{statusMap[lead.status]?.label || lead.status}</span></td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(lead)}><Eye className="h-4 w-4 text-gray-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>문의 상세</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-xs text-gray-500">이름</Label><p className="font-medium">{selected.name}</p></div>
                  <div><Label className="text-xs text-gray-500">회사</Label><p>{selected.company}</p></div>
                  <div><Label className="text-xs text-gray-500">이메일</Label><p>{selected.email}</p></div>
                  <div><Label className="text-xs text-gray-500">전화</Label><p>{selected.phone}</p></div>
                  <div><Label className="text-xs text-gray-500">관심 제품</Label><p>{selected.product_interest}</p></div>
                  <div><Label className="text-xs text-gray-500">언어</Label><p>{selected.locale}</p></div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">문의 내용</Label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded-lg">{selected.message}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">상태 변경</Label>
                  <div className="flex gap-2">
                    {Object.entries(statusMap).map(([value, { label, className }]) => (
                      <button key={value} disabled={updatingStatus} onClick={() => handleStatusChange(value)} className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-colors ${selected.status === value ? className + ' border-current' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDetailOpen(false)}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
