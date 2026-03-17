'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useLogout } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'

export default function Navbar() {
  const { user } = useAuthStore()
  const { items } = useCartStore()
  const { mutate: logout, isPending: loggingOut } = useLogout()
  const { data: wishlist } = useWishlist()

  const cartCount = items.length
  const wishlistCount = wishlist?.length ?? 0

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
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

        <div className="flex items-center gap-1">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2.5 hover:bg-neutral-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2.5 hover:bg-neutral-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 8H4l1-8z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link
                  href="/admin"
                  className="hidden sm:block text-xs font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <div className="relative group">
                <Link
                  href="/account"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm shadow-md hover:shadow-amber-200 transition-shadow"
                >
                  {user.name[0].toUpperCase()}
                </Link>
                {/* Dropdown */}
                <div className="absolute right-0 top-11 w-48 bg-white border border-neutral-100 rounded-2xl shadow-2xl shadow-neutral-200/80 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 duration-200">
                  <Link href="/account" className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    Wishlist
                  </Link>
                  <div className="h-px bg-neutral-100 mx-3 my-1" />
                  <button
                    onClick={() => logout()}
                    disabled={loggingOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-5 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-700 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
