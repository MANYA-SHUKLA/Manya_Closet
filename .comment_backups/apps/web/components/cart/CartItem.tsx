'use client'
import Link from 'next/link'
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart'

import { FALLBACK_IMAGES } from '@/lib/imageUtils'

interface Item {
  _id: string
  product: { _id: string; name: string; images: string[]; isActive: boolean } | string
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export default function CartItem({ item }: { item: Item }) {
  const { mutate: update, isPending: updating } = useUpdateCartItem()
  const { mutate: remove, isPending: removing } = useRemoveCartItem()

  const productSlug =
    typeof item.product === 'object' ? (item.product as { _id: string; name: string }).name : ''

  return (
    <div className={`flex gap-5 py-6 border-b border-neutral-100 last:border-0 transition-opacity ${removing ? 'opacity-40' : ''}`}>
      <div className="w-24 h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-100">
        <img
          src={item.image || FALLBACK_IMAGES[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <p className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2">
              {item.name}
            </p>
            <div className="flex gap-3 mt-1">
              {item.size && (
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {item.size}
                </span>
              )}
              {item.color && (
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full capitalize">
                  {item.color}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => remove(item._id)}
            disabled={removing}
            className="text-neutral-300 hover:text-rose-400 transition-colors flex-shrink-0 p-1"
            aria-label="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 border border-neutral-200 rounded-xl overflow-hidden">
            <button
              onClick={() => item.quantity > 1 && update({ itemId: item._id, quantity: item.quantity - 1 })}
              disabled={item.quantity <= 1 || updating}
              className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-9 text-center text-sm font-semibold text-neutral-900">
              {updating ? (
                <span className="inline-block w-3 h-3 border border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              ) : item.quantity}
            </span>
            <button
              onClick={() => update({ itemId: item._id, quantity: item.quantity + 1 })}
              disabled={updating}
              className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-neutral-900">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-neutral-400">₹{item.price.toLocaleString()} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
