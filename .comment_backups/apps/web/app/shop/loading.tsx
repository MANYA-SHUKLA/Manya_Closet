import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-950 py-14 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="h-96 bg-neutral-100 rounded-2xl animate-pulse" />
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
