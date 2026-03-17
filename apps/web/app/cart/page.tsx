'use client'
import Link from 'next/link'
import { useCart, useClearCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'

function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-5 py-6 border-b border-neutral-100">
          <div className="w-24 h-28 bg-neutral-200 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 bg-neutral-200 rounded-full w-3/4" />
            <div className="h-3 bg-neutral-100 rounded-full w-1/4" />
            <div className="h-9 bg-neutral-100 rounded-xl w-28 mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CartPage() {
  const user = useAuthStore((s) => s.user)
  const { data: cart, isLoading } = useCart()
  const { mutate: clearCart, isPending: clearing } = useClearCart()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-neutral-900">Sign in to view your cart</h2>
          <Link
            href="/login?redirect=/cart"
            className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-2xl font-semibold hover:bg-neutral-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-neutral-900">Cart</h1>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={() => clearCart()}
              disabled={clearing}
              className="text-xs text-neutral-400 hover:text-rose-500 transition-colors disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <CartSkeleton />
            <div className="h-80 bg-neutral-100 rounded-3xl animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Items */}
            <div className="bg-white rounded-3xl border border-neutral-100 px-6 shadow-sm">
              {items.map((item) => (
                <CartItem key={item._id} item={item as never} />
              ))}

              {/* Continue shopping */}
              <div className="py-5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <CartSummary subtotal={subtotal} itemCount={items.length} />
          </div>
        )}
      </div>
    </div>
  )
}
