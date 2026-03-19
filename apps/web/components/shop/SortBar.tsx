'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

export default function SortBar({ total, onFilterClick }: { total: number; onFilterClick: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const current = sp.get('sort') ?? 'newest'

  const setSort = (val: string) => {
    const params = new URLSearchParams(sp.toString())
    params.set('sort', val)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
          </svg>
          Filters
        </button>
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">{total.toLocaleString()}</span> results
        </p>
      </div>

      {/* Sort pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
        <span className="text-xs text-neutral-400 whitespace-nowrap hidden sm:block">Sort by:</span>
        {SORTS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              current === value
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
