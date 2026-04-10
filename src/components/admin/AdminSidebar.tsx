"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Image, Package, Star, BarChart2, Info,
  FileText, Bell, Users, LogOut, MessageSquare, Layers, Type, Scale,
  FolderOpen, History, Trophy, Palette, ChevronDown, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '대시보드',
    items: [
      { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
    ],
  },
  {
    label: '페이지 관리',
    items: [
      { href: '/admin/hero', label: '히어로 슬라이드', icon: Image },
      { href: '/admin/products', label: '제품소개', icon: Package },
      { href: '/admin/about', label: '회사 소개', icon: Info },
      { href: '/admin/history', label: '연혁', icon: History },
      { href: '/admin/track-records', label: '납품실적', icon: Trophy },
      { href: '/admin/notices', label: '공지사항', icon: Bell },
      { href: '/admin/resources', label: '자료실', icon: FileText },
    ],
  },
  {
    label: '콘텐츠',
    items: [
      { href: '/admin/values', label: '핵심 가치', icon: Star },
      { href: '/admin/stats', label: '통계 수치', icon: BarChart2 },
      { href: '/admin/sections', label: '섹션 관리', icon: Layers },
      { href: '/admin/legal', label: '법적고지 관리', icon: Scale },
    ],
  },
  {
    label: '미디어 & 디자인',
    items: [
      { href: '/admin/media', label: '미디어 관리', icon: FolderOpen },
      { href: '/admin/branding', label: '브랜딩 관리', icon: Palette },
      { href: '/admin/typography', label: '글씨체 관리', icon: Type },
    ],
  },
  {
    label: '운영',
    items: [
      { href: '/admin/leads', label: '문의 관리', icon: MessageSquare },
      { href: '/admin/users', label: '사용자 관리', icon: Users },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-64 min-h-screen bg-navy text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="text-lg font-bold">한성우레탄</div>
        <div className="text-xs text-gold tracking-widest mt-0.5">ADMIN PANEL</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {navGroups.map((group) => {
          const isGroupCollapsed = collapsed[group.label]
          const hasActive = group.items.some(item => pathname === item.href)

          return (
            <div key={group.label}>
              {/* Single-item groups (dashboard) render without collapsible header */}
              {group.items.length === 1 ? (
                (() => {
                  const item = group.items[0]
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive ? 'bg-gold text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </Link>
                  )
                })()
              ) : (
                <div>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors',
                      hasActive ? 'text-gold' : 'text-gray-400 hover:text-gray-200'
                    )}
                  >
                    {group.label}
                    {isGroupCollapsed
                      ? <ChevronRight className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!isGroupCollapsed && (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-gold text-white'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            )}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
        >
          사이트 방문 →
        </Link>
      </div>
    </aside>
  )
}
