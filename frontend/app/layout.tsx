import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { MaintenanceNotice } from '@/components/shared/maintenance-notice'
import { ScrollIndicator } from '@/components/shared/scroll-indicator'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'm-pesa smartinfo',
  description: 'Confirme disponibilidade de agentes M-Pesa antes de se deslocar. Encontre agentes disponiveis proximos de si e evite viagens sem sucesso.',
  applicationName: 'm-pesa smartinfo',
  metadataBase: new URL('https://mpesa-smartinfo.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'm-pesa smartinfo',
    description: 'Confirme disponibilidade de agentes M-Pesa antes de se deslocar.',
    url: 'https://mpesa-smartinfo.vercel.app',
    siteName: 'm-pesa smartinfo',
    locale: 'pt_MZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'm-pesa smartinfo',
    description: 'Confirme disponibilidade de agentes M-Pesa antes de se deslocar.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-MZ" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <ScrollIndicator />
        <MaintenanceNotice />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
