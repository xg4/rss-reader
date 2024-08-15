import type { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'RSS Reader',
  description: 'RSS Reader',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-cn">
      <body className="prose prose-slate mx-auto break-all bg-white p-5 text-slate-600 antialiased dark:prose-invert dark:bg-slate-900 dark:text-slate-400">
        {children}
      </body>
    </html>
  )
}
