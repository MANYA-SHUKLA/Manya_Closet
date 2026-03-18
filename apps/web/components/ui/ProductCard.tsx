'use client'
import Link from 'next/link'
import { IProduct } from '@manya-closet/types'
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { getFallbackImage } from '@/lib/imageUtils'

interface Props { product: IProduct }

export default function ProductCard({ product }: Props) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const { data: wishlist } = useWishlist()
  const { mutate: toggleWishlist } = useToggleWishlist()

  const isWishlisted = wishlist?.some((p) => p._id === product._id)
  const imgSrc = product.images[0] || getFallbackImage(product._id)

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) return router.push('/login')
    toggleWishlist(product._id)
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPct && (
            <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow">
              -{discountPct}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full shadow">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all
            opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95
            ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-gray-400 hover:text-rose-500'}`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="mt-3.5 px-1">
        <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-black text-gray-900">
            ₹{(product.discountPrice ?? product.price).toLocaleString()}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        {product.ratings > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-medium text-gray-700">{product.ratings.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
