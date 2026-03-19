import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AuthProvider from '@/providers/AuthProvider'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: "Manya's Closet — Premium Fashion",
  description: 'Curated fashion for the modern woman. Premium quality, timeless style.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${cormorant.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
