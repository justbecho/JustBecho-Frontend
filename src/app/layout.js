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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${quicksand.className}`}>
      <body className="font-sans">
        {/* ❌ HEADER YAHAN SE HATA DO - Kyunki aap already homepage mein import kar rahe ho */}
        <main>{children}</main>
      </body>
    </html>
  )
}