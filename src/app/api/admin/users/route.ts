import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// Returns the verified admin user's id, or null if not an authenticated admin.
async function verifyAdmin(request: NextRequest): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return null

  const authHeader = request.headers.get('Authorization')
  const cookieHeader = request.headers.get('Cookie') || ''

  // Extract token from Authorization header or cookie
  let token = ''
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)
    if (match) token = decodeURIComponent(match[1])
  }

  if (!token) return null

  const verifyClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const { data: { user } } = await verifyClient.auth.getUser(token)
  if (!user) return null

  const admin = createAdminClient()
  if (!admin) return null
  const { data } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()
  return data ? user.id : null
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: admins } = await supabase.from('admin_users').select('user_id, role, is_active')
  const adminMap = new Map((admins ?? []).map(a => [a.user_id, a]))

  const users = data.users.map(u => {
    const a = adminMap.get(u.id)
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      is_admin: !!a?.is_active,
      role: a?.role ?? null,
    }
  })
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Grant admin access to the invited user.
  if (data.user) {
    await supabase.from('admin_users').upsert(
      { user_id: data.user.id, email, is_active: true },
      { onConflict: 'user_id' }
    )
  }
  return NextResponse.json({ user: data.user })
}

export async function PATCH(request: NextRequest) {
  const callerId = await verifyAdmin(request)
  if (!callerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })

  const { user_id, email, is_admin } = await request.json()
  if (!user_id || typeof is_admin !== 'boolean') {
    return NextResponse.json({ error: 'user_id and is_admin are required' }, { status: 400 })
  }
  // Prevent admins from revoking their own access (lockout guard).
  if (user_id === callerId && !is_admin) {
    return NextResponse.json({ error: '본인의 관리자 권한은 해제할 수 없습니다.' }, { status: 400 })
  }

  const { error } = await supabase.from('admin_users').upsert(
    { user_id, email: email ?? '', is_active: is_admin },
    { onConflict: 'user_id' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
