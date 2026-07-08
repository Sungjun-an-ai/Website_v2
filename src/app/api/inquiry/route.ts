import { NextResponse } from 'next/server'
import { isSupabaseConfigured, isResendConfigured } from '@/lib/utils'
import { getClientIp, isValidEmail, rateLimit, sanitizeString } from '@/lib/security'

export async function POST(request: Request) {
  try {
    // Rate limit public submissions per IP.
    const ip = getClientIp(request)
    const rl = rateLimit(`inquiry:${ip}`, 5, 60_000)
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
    const productInterest = sanitizeString(body?.productInterest, 100)
    const message = sanitizeString(body?.message, 5000)
    const locale = sanitizeString(body?.locale, 8) || 'ko'

    if (!name || !email || !message) {
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
      await supabase.from('leads').insert({
        name,
        company: company || null,
        email,
        phone: phone || null,
        product_interest: productInterest || null,
        message,
        locale,
        status: 'new',
      })
    }

    // Send email if Resend is configured
    if (isResendConfigured()) {
      const { sendInquiryEmail, sendAutoReplyEmail } = await import('@/lib/email')
      await Promise.allSettled([
        sendInquiryEmail({ name, company, email, phone, productInterest, message, locale }),
        sendAutoReplyEmail({ name, company, email, phone, productInterest, message, locale }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
