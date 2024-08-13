import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RSS Reader',
  description: 'RSS Reader',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-cn">
      <body className="bg-white text-slate-500 antialiased dark:bg-slate-900 dark:text-slate-400">{children}</body>
    </html>
  )
}
