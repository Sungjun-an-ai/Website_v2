import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
