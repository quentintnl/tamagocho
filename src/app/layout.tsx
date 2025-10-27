import type { Metadata } from 'next'
import { Jersey_10, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'

const jersey10 = Jersey_10({
  variable: '--font-jersey10',
  subsets: ['latin'],
  weight: '400'
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
        className={`${jersey10.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
