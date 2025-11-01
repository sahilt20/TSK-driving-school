import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/providers/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cricket Club Platform - Live Streaming & Scoring',
  description: 'Complete solution for cricket clubs to stream matches live, manage scoring, and analyze performance',
  keywords: ['cricket', 'live streaming', 'scoring', 'cricket club', 'match management'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cricket Stream',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Cricket Club Platform',
    title: 'Cricket Club Platform - Live Streaming & Scoring',
    description: 'Complete solution for cricket clubs to stream matches live, manage scoring, and analyze performance',
  },
  twitter: {
    card: 'summary',
    title: 'Cricket Club Platform - Live Streaming & Scoring',
    description: 'Complete solution for cricket clubs to stream matches live, manage scoring, and analyze performance',
  },
}

export const viewport: Viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
