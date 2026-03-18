import Link from 'next/link'

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

export default function Footer() {
  return (
    <footer className="bg-[#0f0e1e] text-gray-500">

      {/* Newsletter banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-1">Stay in the loop</p>
            <p className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              New drops. Exclusive deals. First access.
            </p>
          </div>
          <form className="flex w-full sm:w-auto gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-400/50 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm rounded-full transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div>
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              Manya&apos;s <span className="text-amber-500 italic">Closet</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Premium fashion curated for the modern woman. Style that speaks before you do.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {[
              {
                label: 'Instagram',
                href: '#',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ),
              },
              {
                label: 'Pinterest',
                href: '#',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                ),
              },
              {
                label: 'Twitter',
                href: '#',
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 flex items-center justify-center transition-all"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
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

      {/* Bottom bar */}
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
