'use client'
import { useEffect, useRef } from 'react'
import { useInfiniteProducts, ProductFilters } from '@/hooks/useInfiniteProducts'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export default function ProductGrid({ filters }: { filters: ProductFilters }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts(filters)

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Infinite scroll via Intersection Observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage() },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const products = data?.pages.flatMap((p) => p.data) ?? []

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-neutral-900">No products found</h3>
        <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`sk-${i}`} />)}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {!hasNextPage && products.length > 0 && (
        <p className="text-center text-sm text-neutral-400 py-8">You&apos;ve seen all products ✓</p>
      )}
    </>
  )
}
