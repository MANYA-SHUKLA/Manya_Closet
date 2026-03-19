'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

const CATEGORIES = [
  { label: 'Dresses',       slug: 'dresses' },
  { label: 'Tops & Blouses', slug: 'tops-blouses' },
  { label: 'Bottoms',       slug: 'bottoms' },
  { label: 'Ethnic Wear',   slug: 'ethnic-wear' },
  { label: 'Western Wear',  slug: 'western-wear' },
  { label: 'Footwear',      slug: 'footwear' },
  { label: 'Accessories',   slug: 'accessories' },
]
const RATINGS = [4, 3, 2]
const PRICE_PRESETS = [
  { label: 'Under ₹999', min: '', max: '999' },
  { label: '₹999 – ₹2,499', min: '999', max: '2499' },
  { label: '₹2,500 – ₹4,999', min: '2500', max: '4999' },
  { label: '₹5,000+', min: '5000', max: '' },
]

export default function FilterPanel({ onClose }: { onClose?: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const active = useCallback(
    (key: string, val: string) => sp.get(key) === val,
    [sp]
  )

  const toggle = (key: string, val: string) => {
    const params = new URLSearchParams(sp.toString())
    if (params.get(key) === val) params.delete(key)
    else params.set(key, val)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
    onClose?.()
  }

  const setPrice = (min: string, max: string) => {
    const params = new URLSearchParams(sp.toString())
    if (min) params.set('minPrice', min); else params.delete('minPrice')
    if (max) params.set('maxPrice', max); else params.delete('maxPrice')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
    onClose?.()
  }

  const clearAll = () => router.push(pathname)

  const hasFilters = ['category', 'minRating', 'minPrice', 'maxPrice', 'sale'].some(
    (k) => sp.has(k)
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-neutral-900 text-lg">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-amber-600 font-medium hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <button
          onClick={() => toggle('sale', 'true')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            active('sale', 'true')
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
          }`}
        >
          <span>🔥 On Sale</span>
          {active('sale', 'true') && <span className="text-rose-400">✓</span>}
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Category</p>
        <div className="space-y-1.5">
          {CATEGORIES.map(({ label, slug }) => {
            const isActive = active('category', slug)
            return (
              <button
                key={slug}
                onClick={() => toggle('category', slug)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200'
                    : 'text-neutral-600 hover:bg-neutral-50 border border-transparent'
                }`}
              >
                {label}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Price Range</p>
        <div className="space-y-1.5">
          {PRICE_PRESETS.map(({ label, min, max }) => {
            const isActive = sp.get('minPrice') === min && sp.get('maxPrice') === max
            return (
              <button
                key={label}
                onClick={() => setPrice(min, max)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200'
                    : 'text-neutral-600 hover:bg-neutral-50 border border-transparent'
                }`}
              >
                {label}
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Min Rating</p>
        <div className="space-y-1.5">
          {RATINGS.map((r) => {
            const val = String(r)
            const isActive = active('minRating', val)
            return (
              <button
                key={r}
                onClick={() => toggle('minRating', val)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200'
                    : 'text-neutral-600 hover:bg-neutral-50 border border-transparent'
                }`}
              >
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r ? 'text-amber-400' : 'text-neutral-300'}>★</span>
                  ))}
                </span>
                <span>& above</span>
                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
