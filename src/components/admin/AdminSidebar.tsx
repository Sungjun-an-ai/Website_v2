"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Image, Package, Star, BarChart2, Info,
  FileText, Bell, Users, LogOut, MessageSquare, Layers, Type
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/hero', label: '히어로 슬라이드', icon: Image },
  { href: '/admin/products', label: '제품 관리', icon: Package },
  { href: '/admin/values', label: '핵심 가치', icon: Star },
  { href: '/admin/stats', label: '통계 수치', icon: BarChart2 },
  { href: '/admin/about', label: '회사 소개', icon: Info },
  { href: '/admin/sections', label: '섹션 관리', icon: Layers },
  { href: '/admin/resources', label: '자료실', icon: FileText },
  { href: '/admin/notices', label: '공지사항', icon: Bell },
  { href: '/admin/leads', label: '문의 관리', icon: MessageSquare },
  { href: '/admin/users', label: '사용자 관리', icon: Users },
  { href: '/admin/typography', label: '글씨체 관리', icon: Type },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-navy text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-navy-700">
        <div className="text-lg font-bold">한성우레탄</div>
        <div className="text-xs text-gold tracking-widest mt-0.5">ADMIN PANEL</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gold text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-navy-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-navy-700 hover:text-white transition-colors w-full"
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
