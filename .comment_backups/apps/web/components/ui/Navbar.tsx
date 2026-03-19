'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useLogout } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user } = useAuthStore()
  const { items } = useCartStore()
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const { data: wishlist } = useWishlist()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const cartCount = items.length
  const wishlistCount = wishlist?.length ?? 0

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-gray-100'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-4">

        {}
        <Link href="/" className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Manya&apos;s <span className="text-amber-500 italic">Closet</span>
          </span>
        </Link>

        {}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
          {[
            { href: '/shop', label: 'Shop' },
            { href: '/shop?category=dresses', label: 'Dresses' },
            { href: '/shop?category=tops-blouses', label: 'Tops' },
            { href: '/shop?sale=true', label: 'Sale', accent: true },
            { href: '/shop?sort=popular', label: 'Trending' },
          ].map(({ href, label, accent }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-gray-900 ${accent ? 'text-rose-500 hover:text-rose-600 font-semibold' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {}
        <div className="flex items-center gap-0.5">
          {}
          <Link href="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {}
          <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 8H4l1-8z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {}
          {user ? (
            <div className="flex items-center gap-1.5 ml-1">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-indigo-700 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <div className="relative group">
                <button className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm hover:shadow-indigo-200/60 hover:shadow-md transition-all">
                  {user.name[0].toUpperCase()}
                </button>
                {}
                <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/80 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-1 group-hover:translate-y-0 duration-200">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  {[
                    { href: '/account/profile', label: 'My Profile' },
                    { href: '/account/orders', label: 'My Orders' },
                    { href: '/account/addresses', label: 'Addresses' },
                    { href: '/wishlist', label: 'Wishlist' },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {label}
                    </Link>
                  ))}
                  <div className="h-px bg-gray-100 mx-3 my-1" />
                  <button
                    onClick={() => logout()}
                    disabled={loggingOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors rounded-b-2xl disabled:opacity-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-5 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Sign In
            </Link>
          )}

          {}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-colors ml-0.5"
          >
            <div className="w-5 space-y-1.5">
              <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
          {[
            { href: '/shop', label: 'Shop All' },
            { href: '/shop?category=dresses', label: 'Dresses' },
            { href: '/shop?category=tops-blouses', label: 'Tops' },
            { href: '/shop?sale=true', label: '🔥 Sale' },
            { href: '/shop?sort=popular', label: 'Trending' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-500 transition-colors border-b border-gray-50 last:border-0">
              {label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <>
              <div className="h-px bg-gray-100 my-1" />
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Admin Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
