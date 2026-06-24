import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let password = ''
  try {
    const body = await request.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    password = ''
  }

  const expected = process.env.SITE_GATE_PASSWORD
  const token = process.env.SITE_GATE_TOKEN

  if (!expected || !token || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('site_gate', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
