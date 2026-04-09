import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, productInterest, message, locale } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      await supabase.from('leads').insert({
        name,
        company: company || null,
        email,
        phone: phone || null,
        product_interest: productInterest || null,
        message,
        locale: locale || 'ko',
        status: 'new',
      })
    }

    // Send email if Resend is configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && resendKey !== 'your_resend_api_key') {
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
