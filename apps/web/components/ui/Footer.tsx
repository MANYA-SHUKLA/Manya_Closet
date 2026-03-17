import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">
            Manya&apos;s <span className="text-amber-500">Closet</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Premium fashion curated for the modern woman. Style that speaks before you do.
          </p>
        </div>

        {[
          {
            title: 'Shop',
            links: [
              { label: 'New Arrivals', href: '/shop?sort=newest' },
              { label: 'Trending', href: '/shop?sort=popular' },
              { label: 'Sale', href: '/shop?sale=true' },
              { label: 'All Products', href: '/shop' },
            ],
          },
          {
            title: 'Help',
            links: [
              { label: 'Track Order', href: '/account/orders' },
              { label: 'Returns', href: '/returns' },
              { label: 'Size Guide', href: '/size-guide' },
              { label: 'Contact Us', href: '/contact' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h4>
            <ul className="space-y-2">
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

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
        <p>© 2026 Manya&apos;s Closet. All rights reserved.</p>
        <p>Made with ❤️ in India</p>
      </div>
    </footer>
  )
}
