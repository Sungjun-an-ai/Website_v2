import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const GATE_COOKIE = 'site_gate';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The gate login page must stay reachable without being redirected.
  if (pathname === '/enter' || pathname.startsWith('/enter/')) {
    return NextResponse.next();
  }

  if (process.env.SITE_GATE_ENABLED === 'true') {
    const token = process.env.SITE_GATE_TOKEN;
    const cookie = request.cookies.get(GATE_COOKIE)?.value;
    if (!token || cookie !== token) {
      const url = request.nextUrl.clone();
      url.pathname = '/enter';
      url.search = '';
      url.searchParams.set('next', pathname + (request.nextUrl.search || ''));
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|admin|api|.*\\..*).*)'],
};
