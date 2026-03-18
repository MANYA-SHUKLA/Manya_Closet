'use client'
import Link from 'next/link'
import { useFeaturedProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export default function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts()

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Handpicked for you</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop?isFeatured=true"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-500 transition-colors group"
          >
            View all
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop?isFeatured=true"
            className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 text-sm transition-colors">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  )
}
