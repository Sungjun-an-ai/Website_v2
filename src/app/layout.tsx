import type { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  let favicon = '/favicon.svg'

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'favicon_url')
        .single()
      if (data?.value) {
        favicon = data.value
      }
    } catch (err) {
      console.error('[Layout] Failed to fetch favicon:', err)
    }
  }

  return {
    title: "한성우레탄 - BONDING TOMORROW TOGETHER",
    description: "36년 우레탄 접착제·지수제 전문 제조기업 한성우레탄",
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  }
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
