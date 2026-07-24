import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const NEW_ORIGIN = 'https://www.hsurethane.com';

// 구 사이트 URL → 새 사이트 대응 페이지 매핑
const LEGACY_MAP: Record<string, string> = {
  '/board/lists/product0': '/ko/products',
  // .co.kr 소유확인 후 서치어드바이저에서 확인한 URL들을 여기 추가
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  // ── [1순위] SSL 인증서 검증 경로(.well-known) — 무조건 통과 ──
  // 아래 301/308 리다이렉트에 삼켜지지 않도록 맨 위에 둡니다.
  if (pathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  // ── [2순위] 네이버/구글 소유확인 파일 — 통과 ──
  if (/^\/(naver|google)[a-z0-9]+\.html$/.test(pathname)) {
    return NextResponse.next();
  }

  // ── [3순위] 구 도메인(.co.kr) → 새 도메인 301(영구) ──
  if (host.endsWith('hsurethane.co.kr')) {
    const dest = LEGACY_MAP[pathname] ?? '/ko';
    return NextResponse.redirect(new URL(dest, NEW_ORIGIN), 301);
  }

  // ── [4순위] 새 도메인: 루트 → /ko 308(영구) ──
  // 고정 타깃이라 308(캐시 가능)로 안전하며, 지역 감지 없이 크롤러가 일관되게 따라옵니다.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ko', request.url), 308);
  }

  // ── 그 외 요청: 기존 로케일 라우팅(next-intl) ──
  return intlMiddleware(request);
}

export const config = {
  // 기존 matcher 유지: _next/_vercel/admin/api 및 점(.) 포함 경로(.well-known,
  // 소유확인 .html, 정적 파일)를 제외 → 인증/정적 파일은 미들웨어를 타지 않습니다.
  matcher: ['/((?!_next|_vercel|admin|api|.*\\..*).*)'],
};

