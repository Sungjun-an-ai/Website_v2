import { NextResponse } from 'next/server'
import { isSupabaseConfigured, isResendConfigured } from '@/lib/utils'
import { getClientIp, isValidEmail, rateLimit, sanitizeString } from '@/lib/security'

export async function POST(request: Request) {
  try {
    // Rate limit public submissions per IP.
    const ip = getClientIp(request)
    const rl = rateLimit(`catalog:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    const body = await request.json()

    const name = sanitizeString(body?.name, 100)
    const company = sanitizeString(body?.company, 150)
    const email = sanitizeString(body?.email, 254)
    const phone = sanitizeString(body?.phone, 40)
    const resourceId = sanitizeString(body?.resourceId, 100)
    const resourceTitle = sanitizeString(body?.resourceTitle, 200)
    const locale = sanitizeString(body?.locale, 8) || 'ko'

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )
      await supabase.from('catalog_downloads').insert({
        name,
        company: company || null,
        email,
        phone: phone || null,
        resource_id: resourceId || null,
        locale,
      })
    }

    // Send notification email if configured
    if (isResendConfigured()) {
      const { sendCatalogEmail } = await import('@/lib/email')
      await sendCatalogEmail({ name, company, email, phone, resourceTitle }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Catalog download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
