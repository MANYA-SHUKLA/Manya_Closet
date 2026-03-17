'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import FilterPanel from '@/components/shop/FilterPanel'
import SortBar from '@/components/shop/SortBar'
import ProductGrid from '@/components/shop/ProductGrid'
import ActiveFilters from '@/components/shop/ActiveFilters'
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts'

function ShopContent() {
  const sp = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filters = {
    category: sp.get('category') ?? undefined,
    brand: sp.get('brand') ?? undefined,
    minPrice: sp.get('minPrice') ?? undefined,
    maxPrice: sp.get('maxPrice') ?? undefined,
    minRating: sp.get('minRating') ?? undefined,
    sort: sp.get('sort') ?? undefined,
    search: sp.get('search') ?? undefined,
    isFeatured: sp.get('isFeatured') ?? undefined,
    sale: sp.get('sale') ?? undefined,
  }

  const { data } = useInfiniteProducts(filters)
  const total = data?.pages[0]?.pagination.total ?? 0

  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-neutral-950 to-neutral-800 py-14 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-2">Collection</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            {filters.category
              ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
              : 'All Products'}
          </h1>
          <p className="mt-2 text-neutral-400">Curated fashion, delivered to your door</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <SortBar total={total} onFilterClick={() => setMobileFiltersOpen(true)} />
            <div className="mt-4">
              <ActiveFilters />
              <ProductGrid filters={filters} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <FilterPanel onClose={() => setMobileFiltersOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
