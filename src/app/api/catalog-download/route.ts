import { NextResponse } from 'next/server'
import { isSupabaseConfigured, isResendConfigured } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, resourceId, resourceTitle, locale } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
        locale: locale || 'ko',
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
