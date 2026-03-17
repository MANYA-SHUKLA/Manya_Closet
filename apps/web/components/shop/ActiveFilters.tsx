'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const LABELS: Record<string, (v: string) => string> = {
  category: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  minRating: (v) => `${v}★ & above`,
  sale: () => 'On Sale',
  minPrice: (v) => `Min ₹${v}`,
  maxPrice: (v) => `Max ₹${v}`,
  search: (v) => `"${v}"`,
}

const FILTER_KEYS = ['category', 'minRating', 'sale', 'minPrice', 'maxPrice', 'search']

export default function ActiveFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const active = FILTER_KEYS.flatMap((key) => {
    const val = sp.get(key)
    return val ? [{ key, val }] : []
  })

  if (active.length === 0) return null

  const remove = (key: string) => {
    const params = new URLSearchParams(sp.toString())
    params.delete(key)
    if (key === 'minPrice') params.delete('maxPrice')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {active.map(({ key, val }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-full"
        >
          {LABELS[key]?.(val) ?? val}
          <button onClick={() => remove(key)} className="hover:text-amber-900 ml-0.5">✕</button>
        </span>
      ))}
    </div>
  )
}
