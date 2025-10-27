import type { Metadata } from 'next'
import { DynaPuff, Geist_Mono } from 'next/font/google'
import './globals.css'

const dynaPuff = DynaPuff({
  variable: '--font-dynapuff',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  appleWebApp: {
    title: 'Tamagotcho'
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png' },
      { url: '/icon0.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/apple-icon.png' }]
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html lang='fr'>
      <body
        className={`${dynaPuff.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
