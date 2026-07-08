import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getClientIp, rateLimit } from '@/lib/security'

export const runtime = 'nodejs'

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|flipboard|tumblr|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios|node-fetch/i

function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|iphone|android/i.test(ua)) return 'mobile'
  return 'desktop'
}

export async function POST(request: NextRequest) {
  try {
    // Throttle analytics writes per IP to prevent DB spam.
    const ip = getClientIp(request)
    const rl = rateLimit(`track:${ip}`, 60, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }

    const body = await request.json().catch(() => ({}))
    const path = typeof body.path === 'string' ? body.path.slice(0, 512) : ''
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 512) : ''
    const locale = typeof body.locale === 'string' ? body.locale.slice(0, 8) : ''
    if (!path) return NextResponse.json({ ok: false }, { status: 400 })

    const ua = request.headers.get('user-agent') ?? ''
    const isBot = BOT_RE.test(ua)
    const device = detectDevice(ua)

    let visitorId = request.cookies.get('hsu_vid')?.value ?? ''
    let setCookie = false
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      setCookie = true
    }

    const supabase = await createServiceClient()
    await supabase.from('page_views').insert({
      visitor_id: visitorId,
      path,
      referrer,
      locale,
      device,
      is_bot: isBot,
      user_agent: ua.slice(0, 512),
    })

    const res = NextResponse.json({ ok: true }, { status: 200 })
    if (setCookie) {
      res.cookies.set('hsu_vid', visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      })
    }
    return res
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
