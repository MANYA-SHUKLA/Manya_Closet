'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useLogout } from '@/hooks/useAuth'

export default function Navbar() {
  const { user } = useAuthStore()
  const { items } = useCartStore()
  const { mutate: logout, isPending: loggingOut } = useLogout()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-neutral-900 tracking-tight">
          Manya&apos;s <span className="text-amber-500">Closet</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <Link href="/shop?category=dresses" className="hover:text-neutral-900 transition-colors">Dresses</Link>
          <Link href="/shop?category=tops" className="hover:text-neutral-900 transition-colors">Tops</Link>
          <Link href="/shop?sort=popular" className="hover:text-neutral-900 transition-colors">Trending</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 8H4l1-8z" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link href="/admin" className="text-sm text-amber-600 font-semibold hover:underline">
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => logout()}
                disabled={loggingOut}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
              >
                Logout
              </button>
              <Link href="/account" className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                {user.name[0]}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
