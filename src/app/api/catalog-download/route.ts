import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, resourceId, resourceTitle, locale } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      await supabase.from('catalog_downloads').insert({
        name,
        company: company || null,
        email,
        phone: phone || null,
        resource_id: resourceId || null,
        locale: locale || 'ko',
      })
    }

    // Send notification email if configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && resendKey !== 'your_resend_api_key') {
      const { sendCatalogEmail } = await import('@/lib/email')
      await sendCatalogEmail({ name, company, email, phone, resourceTitle }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Catalog download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
