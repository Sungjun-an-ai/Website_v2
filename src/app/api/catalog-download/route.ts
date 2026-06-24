import { NextResponse } from 'next/server'
import { isResendConfigured } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, resourceTitle } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Privacy: do not persist personal data. Forward the request straight to the
    // company inbox so nothing is stored in the database.
    if (!isResendConfigured()) {
      console.error('Catalog request not delivered: email service (Resend) is not configured')
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    const { sendCatalogEmail } = await import('@/lib/email')
    await sendCatalogEmail({ name, company, email, phone, resourceTitle })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Catalog download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

