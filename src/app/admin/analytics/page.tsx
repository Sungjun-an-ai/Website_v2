"use client"

import { useCallback, useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Activity, Users, CalendarDays, Eye, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Summary = { pv_today: number; dau_today: number; pv_7d: number; mau_30d: number; pv_total: number }
type Daily = { day: string; pv: number; uv: number }
type TopPath = { path: string; pv: number }
type TopRef = { referrer: string; pv: number }
type LogRow = { created_at: string; path: string; locale: string; device: string; referrer: string; is_bot: boolean }

const PERIODS = [7, 30, 90] as const

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<number>(30)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [daily, setDaily] = useState<Daily[]>([])
  const [topPaths, setTopPaths] = useState<TopPath[]>([])
  const [topRefs, setTopRefs] = useState<TopRef[]>([])
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const [s, d, p, r, l] = await Promise.all([
      supabase.rpc('analytics_summary'),
      supabase.rpc('analytics_daily', { p_days: days }),
      supabase.rpc('analytics_top_paths', { p_days: days, p_limit: 10 }),
      supabase.rpc('analytics_top_referrers', { p_days: days, p_limit: 10 }),
      supabase
        .from('page_views')
        .select('created_at, path, locale, device, referrer, is_bot')
        .order('created_at', { ascending: false })
        .limit(50),
    ])
    setSummary((s.data?.[0] as Summary) ?? null)
    setDaily((d.data as Daily[]) ?? [])
    setTopPaths((p.data as TopPath[]) ?? [])
    setTopRefs((r.data as TopRef[]) ?? [])
    setLogs((l.data as LogRow[]) ?? [])
    setLoading(false)
  }, [days])

  useEffect(() => { fetchAll() }, [fetchAll])

  const maxPv = Math.max(1, ...daily.map(d => d.pv))
  const fmtNum = (n: number | undefined) => (n ?? 0).toLocaleString('ko-KR')
  const fmtDate = (s: string) => new Date(s).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  const cards = [
    { label: '오늘 방문수 (PV)', value: summary?.pv_today, icon: Eye },
    { label: '오늘 방문자 (DAU)', value: summary?.dau_today, icon: Users },
    { label: '월간 방문자 (MAU 30일)', value: summary?.mau_30d, icon: CalendarDays },
    { label: '누적 방문수', value: summary?.pv_total, icon: Activity },
  ]

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">트래픽 분석</h1>
            <p className="text-sm text-gray-500 mt-1">방문 로그 기반 유입·PV·DAU·MAU 지표 (봇 트래픽 제외)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setDays(p)}
                  className={`px-3 py-1.5 text-sm font-medium ${days === p ? 'bg-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}일
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />새로고침
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(c => {
            const Icon = c.icon
            return (
              <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{c.label}</span>
                  <Icon className="h-4 w-4 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{loading ? '—' : fmtNum(c.value)}</div>
              </div>
            )
          })}
        </div>

        {/* Daily chart */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">일별 방문 추이 (최근 {days}일)</h2>
          {daily.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">데이터가 없습니다.</p>
          ) : (
            <div className="flex items-end gap-1 h-48">
              {daily.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div
                    className="w-full bg-navy/80 hover:bg-navy rounded-t transition-all"
                    style={{ height: `${(d.pv / maxPv) * 100}%` }}
                  />
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                    {d.day} · PV {d.pv} · UV {d.uv}
                  </div>
                </div>
              ))}
            </div>
          )}
          {daily.length > 0 && (
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>{daily[0]?.day}</span>
              <span>{daily[daily.length - 1]?.day}</span>
            </div>
          )}
        </section>

        {/* Top paths + referrers */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 페이지</h2>
            <div className="space-y-2">
              {topPaths.length === 0 && <p className="text-sm text-gray-400">데이터가 없습니다.</p>}
              {topPaths.map(p => (
                <div key={p.path} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate mr-3">{p.path}</span>
                  <span className="font-semibold text-gray-900 shrink-0">{fmtNum(p.pv)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">유입 경로 (Referrer)</h2>
            <div className="space-y-2">
              {topRefs.length === 0 && <p className="text-sm text-gray-400">데이터가 없습니다.</p>}
              {topRefs.map(r => (
                <div key={r.referrer} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate mr-3">{r.referrer}</span>
                  <span className="font-semibold text-gray-900 shrink-0">{fmtNum(r.pv)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent logs */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 방문 로그</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">시각</th>
                  <th className="py-2 pr-4 font-medium">경로</th>
                  <th className="py-2 pr-4 font-medium">언어</th>
                  <th className="py-2 pr-4 font-medium">기기</th>
                  <th className="py-2 pr-4 font-medium">유입</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400">로그가 없습니다.</td></tr>
                )}
                {logs.map((l, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{fmtDate(l.created_at)}</td>
                    <td className="py-2 pr-4 text-gray-800 max-w-[220px] truncate">
                      {l.path}{l.is_bot && <span className="ml-2 text-[10px] text-orange-500">BOT</span>}
                    </td>
                    <td className="py-2 pr-4 text-gray-500 uppercase">{l.locale || '—'}</td>
                    <td className="py-2 pr-4 text-gray-500">{l.device || '—'}</td>
                    <td className="py-2 pr-4 text-gray-500 max-w-[220px] truncate">{l.referrer || '(direct)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
