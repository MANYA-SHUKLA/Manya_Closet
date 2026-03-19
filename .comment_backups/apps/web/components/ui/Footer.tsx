'use client'
import Link from 'next/link'
import { useState } from 'react'
import api from '@/lib/axios'

const NAV_COLS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Trending Now', href: '/shop?sort=popular' },
      { label: 'Sale', href: '/shop?sale=true' },
      { label: 'All Products', href: '/shop' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track Order', href: '/account/orders' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const { data } = await api.post('/newsletter/subscribe', { email })
      setMsg(data.message)
      setStatus('success')
      setEmail('')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setMsg(e.response?.data?.message ?? 'Something went wrong. Try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-emerald-300 text-sm">{msg}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-400/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm rounded-full transition-colors flex-shrink-0 disabled:opacity-60"
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="text-rose-400 text-xs pl-2">{msg}</p>}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0f0e1e] text-gray-500">

      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-1">Stay in the loop</p>
            <p className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              New drops. Exclusive deals. First access.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              Manya&apos;s <span className="text-amber-500 italic">Closet</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Premium fashion curated for the modern woman. Style that speaks before you do.
          </p>
          <div className="flex gap-3">
            {[
              {
                label: 'GitHub',
                href: 'https://github.com/MANYA-SHUKLA',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/manya-shukla99/',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
              {
                label: 'WhatsApp',
                href: 'https://wa.me/8005586558',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 flex items-center justify-center transition-all"
              >
                {icon}
              </a>
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Portfolios</p>
            {[
              'https://manya-shukla.vercel.app/',
              'https://shuklamanya.vercel.app/',
              'https://manyashukla.vercel.app/',
            ].map((href) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {href.replace('https://', '').replace('/', '')}
              </a>
            ))}
          </div>
        </div>

        {}
        {NAV_COLS.map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-5">{title}</h4>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© 2026 Manya&apos;s Closet. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with
            <svg className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            by <span className="text-gray-400 font-medium ml-1">Manya Shukla</span>
            <span className="mx-1.5 text-gray-700">·</span>
            2026
          </p>
        </div>
      </div>
    </footer>
  )
}
