'use client'
import Link from 'next/link'
import { useFeaturedProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export default function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts()

  return (
    <section className="py-20 px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">Featured Products</h2>
            <p className="mt-2 text-neutral-500">Handpicked pieces for you</p>
          </div>
          <Link
            href="/shop?isFeatured=true"
            className="hidden sm:inline-flex text-sm font-medium text-amber-600 hover:text-amber-700 underline-offset-4 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </section>
  )
}
