"use client"

import { useState } from 'react'
import { AlertCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const params = new URLSearchParams(window.location.search)
        const next = params.get('next') || '/'
        // Only allow same-site absolute paths; block protocol-relative (//host)
        // and absolute URLs to prevent open redirect.
        const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
        window.location.href = safeNext
      } else {
        setError('암호가 올바르지 않습니다.')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-navy">한성우레탄</div>
            <div className="text-xs text-gold tracking-widest mt-1">INTERNAL TEST ACCESS</div>
          </div>

          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5">
              <Lock className="h-5 w-5 text-navy" />
            </div>
          </div>

          <p className="mb-6 text-center text-sm text-gray-500">
            내부 테스트 중입니다. 접근 암호를 입력해 주세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">접근 암호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="암호를 입력해 주세요"
                required
                autoFocus
                className="mt-1"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? '확인 중...' : '입장하기'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} HANSUNG URETHANE CO., LTD
        </p>
      </div>
    </div>
  )
}
