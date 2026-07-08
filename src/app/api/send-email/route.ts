import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { getClientIp, rateLimit, sanitizeString } from '@/lib/security'

// Allowed recipients for programmatic email sending. Only company mailboxes
// may receive mail through this endpoint to prevent abuse as a spam relay.
const ALLOWED_RECIPIENTS = new Set(
  (process.env.SEND_EMAIL_ALLOWED_RECIPIENTS || 'info@hsurethane.co.kr')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
)

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Verify the caller is an authenticated allowlisted admin.
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return false

  const authHeader = request.headers.get('Authorization')
  const cookieHeader = request.headers.get('Cookie') || ''

  let token = ''
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)
    if (match) token = decodeURIComponent(match[1])
  }
  if (!token) return false

  const verifyClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: { user } } = await verifyClient.auth.getUser(token)
  if (!user) return false

  const admin = createAdminClient()
  if (!admin) return false
  const { data } = await admin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()
  return Boolean(data)
}

export async function POST(request: NextRequest) {
  // Rate limit by IP to curb abuse.
  const ip = getClientIp(request)
  const rl = rateLimit(`send-email:${ip}`, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  // Require an authenticated admin — this endpoint is not public.
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const to = sanitizeString(body?.to, 254).toLowerCase()
    const subject = sanitizeString(body?.subject, 200)
    const html = typeof body?.html === 'string' ? body.html.slice(0, 100_000) : ''

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Only permit sending to explicitly allowlisted recipients.
    if (!ALLOWED_RECIPIENTS.has(to)) {
      return NextResponse.json({ error: 'Recipient not allowed' }, { status: 403 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey || resendKey === 'your_resend_api_key') {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)

    const { data, error } = await resend.emails.send({
      from: 'Hansung Urethane <noreply@hsurethane.co.kr>',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
