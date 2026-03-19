import Link from 'next/link'

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="w-32 h-32 rounded-full bg-amber-50 flex items-center justify-center">
          <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 8H4l1-8z"
            />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-lg">
          🛍️
        </span>
      </div>

      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
      <p className="text-neutral-500 text-sm max-w-sm leading-relaxed mb-8">
        Looks like you haven&apos;t added anything yet. Explore our collection and find something you love!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-neutral-900 text-white font-semibold rounded-2xl hover:bg-neutral-700 transition-all hover:shadow-lg active:scale-95"
        >
          Start Shopping
        </Link>
        <Link
          href="/shop?isFeatured=true"
          className="px-8 py-3.5 border border-neutral-200 text-neutral-700 font-semibold rounded-2xl hover:bg-neutral-50 transition-all"
        >
          View Featured
        </Link>
      </div>
    </div>
  )
}
