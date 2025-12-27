// app/layout.js - SERVER COMPONENT (NO 'use client')
import './globals.css'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
})

export const metadata = {
  title: 'Just Becho - India\'s Most Trusted Luxury Marketplace',
  description: 'India\'s most trusted marketplace for selling pre-loved luxury items. Authentic luxury bags, watches, and accessories.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    android: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${quicksand.className}`}>
      <body className="font-sans">
        <main>{children}</main>
      </body>
    </html>
  )
}