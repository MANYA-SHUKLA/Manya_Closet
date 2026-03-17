export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-neutral-200" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-3 w-16 bg-neutral-200 rounded-full" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded-full" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded-full" />
      </div>
    </div>
  )
}
