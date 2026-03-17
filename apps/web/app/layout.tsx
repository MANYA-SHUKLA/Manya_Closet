import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: "Manya's Closet",
  description: 'Premium fashion e-commerce store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
