import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "한성우레탄 - BONDING TOMORROW TOGETHER",
  description: "36년 우레탄 접착제·지수제 전문 제조기업 한성우레탄",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
