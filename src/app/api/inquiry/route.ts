import { NextResponse } from 'next/server'
import { isResendConfigured } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, phone, productInterest, message, locale } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Privacy: do not persist personal data. Forward the inquiry straight to the
    // company inbox so nothing is stored in the database.
    if (!isResendConfigured()) {
      console.error('Inquiry not delivered: email service (Resend) is not configured')
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    const { sendInquiryEmail, sendAutoReplyEmail } = await import('@/lib/email')

    // The notification to the company is the system of record — if it cannot be
    // delivered we must fail loudly so the submitter knows to retry or call.
    await sendInquiryEmail({ name, company, email, phone, productInterest, message, locale })

    // The customer auto-reply is best-effort and must never block the submission.
    await sendAutoReplyEmail({ name, company, email, phone, productInterest, message, locale }).catch(
      (err) => console.error('Auto-reply email failed:', err),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
