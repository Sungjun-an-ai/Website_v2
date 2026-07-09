import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry');

  // Keep international locale detection, but default KR traffic at root to /ko.
  if (request.nextUrl.pathname === '/' && country?.toUpperCase() === 'KR') {
    const url = request.nextUrl.clone();
    url.pathname = '/ko';
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|admin|api|.*\\..*).*)'],
};
