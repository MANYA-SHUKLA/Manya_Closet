'use client'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/axios'
import { useToggleWishlist } from '@/hooks/useWishlist'
import { useCartStore } from '@/store/cartStore'
import { IProduct } from '@manya-closet/types'

import { getFallbackImage } from '@/lib/imageUtils'

export default function WishlistItem({ product }: { product: IProduct }) {
  const qc = useQueryClient()
  const { mutate: remove } = useToggleWishlist()
  const [moved, setMoved] = useState(false)

  const { mutate: moveToCart, isPending } = useMutation({
    mutationFn: () =>
      api.post('/cart', {
        productId: product._id,
        quantity: 1,
        size: product.variants[0]?.size ?? '',
        color: product.variants[0]?.color ?? '',
      }),
    onSuccess: ({ data }) => {
      useCartStore.getState().setCart(data.data.items, data.data.total)
      qc.invalidateQueries({ queryKey: ['cart'] })
      remove(product._id)
      setMoved(true)
    },
  })

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  const imgSrc = product.images[0] || getFallbackImage(product._id)
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0)

  if (moved) return null

  return (
    <div className="group relative bg-white rounded-3xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPct && (
              <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                -{discountPct}%
              </span>
            )}
            {totalStock === 0 && (
              <span className="px-2.5 py-1 bg-neutral-800/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Remove from wishlist */}
          <button
            onClick={() => remove(product._id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove from wishlist"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">{product.brand}</p>
          <Link href={`/product/${product.slug}`}>
            <p className="text-sm font-semibold text-neutral-900 mt-0.5 line-clamp-2 hover:text-amber-700 transition-colors">
              {product.name}
            </p>
          </Link>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-base font-black text-neutral-900">
              ₹{(product.discountPrice ?? product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.ratings > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs font-medium text-neutral-700">{product.ratings.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Move to Cart */}
        <button
          onClick={() => moveToCart()}
          disabled={isPending || totalStock === 0}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            totalStock === 0
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-900 hover:bg-amber-500 hover:text-black text-white active:scale-95'
          } disabled:opacity-60`}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Moving…
            </span>
          ) : totalStock === 0 ? 'Out of Stock' : 'Move to Cart'}
        </button>
      </div>
    </div>
  )
}
