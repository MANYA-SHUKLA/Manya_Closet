'use client'
import Link from 'next/link'
import { IProduct } from '@manya-closet/types'

interface Props {
  product: IProduct
}

export default function ProductCard({ product }: Props) {
  const discountPct =
    product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4]">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No Image
          </div>
        )}
        {discountPct && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="mt-3 px-1">
        <p className="text-xs text-neutral-400 uppercase tracking-wider">{product.brand}</p>
        <p className="text-sm font-semibold text-neutral-900 mt-0.5 line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-neutral-900">
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
            <span className="text-xs text-neutral-500">
              {product.ratings.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
