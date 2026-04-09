import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 - 한성우레탄',
  description: 'Hansung Urethane Admin Panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}
