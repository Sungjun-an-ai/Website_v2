# 한성우레탄 기업 홈페이지 (Hansung Urethane Website)

> **BONDING TOMORROW TOGETHER** — 36년 우레탄 접착제·지수제 전문 제조기업

Next.js 15 App Router 기반 완전한 기업 홈페이지 + 어드민 CMS 시스템입니다.

---

## 📋 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [Supabase 설정](#supabase-설정)
- [이메일 설정 (Resend)](#이메일-설정-resend)
- [배포 (Vercel)](#배포-vercel)
- [어드민 페이지](#어드민-페이지)
- [주요 기능](#주요-기능)

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 백엔드/DB | Supabase (PostgreSQL + Auth + Storage) |
| 다국어 | next-intl (한국어 / 영어) |
| Hero 캐러셀 | Swiper.js 12 |
| 이메일 | Resend |
| 지도 | Google Maps Embed API |
| 배포 | Vercel |

---

## 📁 프로젝트 구조

```
Website_v2/
├── src/
│   ├── app/
│   │   ├── [locale]/           # 다국어 라우팅 (ko, en)
│   │   │   ├── page.tsx        # 메인 랜딩 페이지
│   │   │   ├── products/[slug]/# 제품 상세 페이지
│   │   │   ├── about/          # 회사 소개
│   │   │   │   ├── history/    # 연혁
│   │   │   │   └── track-record/ # 납품 실적
│   │   │   ├── resources/      # 기술 자료
│   │   │   └── notice/         # 공지사항
│   │   ├── admin/              # 어드민 CMS (/admin)
│   │   │   ├── login/          # 로그인
│   │   │   ├── dashboard/      # 대시보드
│   │   │   ├── hero/           # Hero 슬라이드 관리
│   │   │   ├── products/       # 제품 관리
│   │   │   ├── values/         # 핵심 가치 관리
│   │   │   ├── stats/          # 실적 수치 관리
│   │   │   ├── about/          # 회사 소개 관리
│   │   │   ├── resources/      # 기술 자료 관리
│   │   │   ├── notices/        # 공지사항 관리
│   │   │   ├── leads/          # 문의/리드 관리 (CSV 내보내기)
│   │   │   ├── sections/       # 섹션 순서 관리
│   │   │   └── users/          # 사용자 관리
│   │   └── api/
│   │       ├── inquiry/        # 문의 폼 API
│   │       ├── catalog-download/ # 카탈로그 다운로드 API
│   │       └── send-email/     # 이메일 발송 API
│   ├── components/
│   │   ├── ui/                 # 기본 UI 컴포넌트 (shadcn/ui)
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # 홈 페이지 섹션 컴포넌트
│   │   ├── products/           # 제품 관련 컴포넌트
│   │   └── admin/              # 어드민 레이아웃 컴포넌트
│   ├── lib/
│   │   ├── supabase/           # Supabase 클라이언트
│   │   ├── email/              # 이메일 유틸리티
│   │   └── utils/              # 공통 유틸리티 (CSV export 등)
│   ├── i18n/                   # 다국어 설정
│   │   ├── ko.json             # 한국어 번역
│   │   └── en.json             # 영어 번역
│   └── types/                  # TypeScript 타입 정의
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # DB 스키마 마이그레이션
├── public/
│   └── images/                 # 정적 이미지
├── .env.example                # 환경 변수 템플릿
└── README.md
```

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/Sungjun-an-ai/Website_v2.git
cd Website_v2
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 편집하여 실제 값을 입력하세요
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속 → 자동으로 `/ko` 로 리다이렉트됩니다.

---

## ⚙️ 환경 변수 설정

`.env.local` 파일에 다음 변수들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (이메일 발송)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=info@hsurethane.co.kr

# Google Maps (선택 사항 — iframe embed는 API 키 불필요)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 🗄️ Supabase 설정

### 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. Project Settings → API에서 URL과 키를 복사하여 `.env.local`에 입력

### 2. DB 스키마 마이그레이션

Supabase 대시보드 → SQL Editor에서 다음 파일을 실행하세요:

```
supabase/migrations/001_initial_schema.sql
```

이 파일에는 다음 테이블들이 포함됩니다:
- `hero_slides` — Hero 캐러셀 슬라이드
- `products` — 제품 정보
- `core_values` — 핵심 가치
- `stats` — 실적 수치
- `company_info` — 회사 정보
- `history` — 연혁
- `track_records` — 납품 실적
- `resources` — 기술 자료 (PDF)
- `notices` — 공지사항
- `inquiries` — 문의 내용
- `catalog_downloads` — 카탈로그 다운로드 리드

### 3. Storage 버킷 생성 (이미지/파일 업로드용)

Supabase 대시보드 → Storage에서 버킷 생성:
- `images` (Public) — 이미지 파일
- `catalogs` (Public) — 카탈로그 PDF
- `resources` (Public) — 기술 자료 PDF

### 4. 어드민 사용자 생성

Supabase 대시보드 → Authentication → Users에서 관리자 이메일/비밀번호 계정 생성 후, SQL Editor에서 권한 부여:

```sql
-- 생성한 사용자 ID를 조회
SELECT id, email FROM auth.users;

-- 슈퍼 어드민 권한 부여 (user_id를 실제 UUID로 교체)
UPDATE admin_users SET role = 'super_admin' WHERE user_id = 'your-user-uuid';
```

---

## 📧 이메일 설정 (Resend)

1. [https://resend.com](https://resend.com) 에서 계정 생성
2. API Keys 메뉴에서 API 키 생성
3. 발송 도메인 설정 (DNS TXT 레코드 추가)
4. `.env.local`의 `RESEND_API_KEY`에 입력

이메일 발송 기능:
- 문의 폼 제출 시 → 관리자(`ADMIN_EMAIL`)에게 알림 이메일 발송
- 카탈로그 다운로드 요청 시 → 고객 이메일로 카탈로그 안내 이메일 자동 발송

---

## 🚢 배포 (Vercel)

### 1. Vercel 연결

```bash
npm install -g vercel
vercel
```

또는 [https://vercel.com](https://vercel.com)에서 GitHub 저장소 연결

### 2. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 `.env.local`의 모든 변수를 추가

### 3. 빌드 설정

- Framework Preset: Next.js (자동 감지)
- Build Command: `npm run build`
- Output Directory: `.next`

---

## 🔐 어드민 페이지

어드민 페이지는 `/admin` 경로에 있습니다.

### 접속

```
URL: https://your-domain.com/admin/login
```

### 권한 체계

| 역할 | 권한 |
|------|------|
| **Super Admin** | 모든 기능 + 사용자 관리 + 권한 부여 |
| **Editor** | 콘텐츠 편집 (텍스트, 이미지, 섹션) |
| **Viewer** | 읽기 전용 |

### 주요 기능

#### 콘텐츠 관리
- **Hero 슬라이드**: 이미지/동영상 업로드, 텍스트 편집(KR/EN), 순서 변경
- **제품**: 제품 추가/수정/삭제, 카탈로그 PDF 업로드
- **핵심 가치**: Technology / Trust / Chemical Solution 편집
- **실적 수치**: 홈페이지 표시 수치 설정
- **회사 소개**: 연혁, 납품 실적 관리
- **기술 자료**: PDF 업로드 및 카테고리 분류

#### 영업 리드 관리
- **문의 리스트**: 고객 문의 내용 조회 및 상태 관리
- **CSV 내보내기**: 영업팀 활용을 위한 데이터 다운로드
- 상태 관리: 신규 → 연락완료 → 종결

---

## 🌏 다국어 지원

- 한국어 (`/ko`) — 기본 언어
- 영어 (`/en`)
- 상단 헤더의 KR/EN 버튼으로 토글

번역 파일: `src/i18n/ko.json`, `src/i18n/en.json`

---

## 📦 주요 기능

### 공개 사이트

#### Hero 캐러셀
- Swiper.js 기반 좌우 스와이프
- 이미지/동영상(mp4) 혼합 지원
- 슬라이드별 텍스트 변동 (Fade 효과)
- 자동 재생 (5초 간격) + 수동 스와이프
- 모바일 터치 지원

#### 문의 폼
- 회사명, 담당자명, 이메일, 연락처, 관심 제품군, 문의 내용 수집
- 이메일 유효성 검사
- Supabase DB 저장 + 관리자 이메일 알림

#### 카탈로그 다운로드
- 각 제품 페이지의 [카탈로그 다운로드] 버튼
- 팝업 폼으로 정보 입력
- 고객 이메일로 자료 자동 발송
- 영업 리드로 DB 적재

#### 지도
- Google Maps Embed API (iframe 방식)
- 경기 파주시 광탄면 장지산로 184-12

### 제품 페이지

| 슬러그 | 제품명 |
|--------|--------|
| `/products/hs-100` | 지수제 (Water Stop Agent) — WS-7000 Series |
| `/products/hs-200` | 준불연 접착제 (Semi-Noncombustible Adhesive) |
| `/products/hs-300` | 우레탄 접착제 (Urethane Adhesive) |
| `/products/hs-400` | 케미컬 솔루션 (Chemical Solution) |

---

## 🔧 개발 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

---

## 📞 회사 정보

| 항목 | 내용 |
|------|------|
| 회사명 | 한성우레탄 (Hansung Urethane Co., Ltd.) |
| 주소 | 경기 파주시 광탄면 장지산로 184-12 |
| 전화 | 031-943-8732 |
| 팩스 | 031-943-9756 |
| 이메일 | info@hsurethane.co.kr |
| 슬로건 | BONDING TOMORROW TOGETHER |
