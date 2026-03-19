'use client'
import Link from 'next/link'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthStore } from '@/store/authStore'
import WishlistItem from '@/components/wishlist/WishlistItem'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export default function WishlistPage() {
  const user = useAuthStore((s) => s.user)
  const { data: items = [], isLoading } = useWishlist()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-neutral-900">Sign in to view your wishlist</h2>
          <Link
            href="/login?redirect=/wishlist"
            className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-2xl font-semibold hover:bg-neutral-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-rose-950 via-neutral-950 to-neutral-900 py-14 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-rose-400 text-sm font-medium uppercase tracking-widest mb-2">Your Collection</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">Wishlist</h1>
          <p className="mt-2 text-neutral-400">
            {isLoading ? '…' : `${items.length} saved ${items.length === 1 ? 'item' : 'items'}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Nothing saved yet</h2>
            <p className="text-neutral-500 text-sm mb-8 max-w-xs">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-neutral-900 text-white font-semibold rounded-2xl hover:bg-neutral-700 transition-all hover:shadow-lg active:scale-95"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Link
                href="/shop"
                className="text-sm text-amber-600 font-medium hover:underline"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((product) => (
                <WishlistItem key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
