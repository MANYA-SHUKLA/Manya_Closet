export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-64 bg-neutral-200 rounded-full mb-8" />
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-neutral-200 rounded-3xl" />
        <div className="space-y-5">
          <div className="h-3 w-24 bg-neutral-200 rounded-full" />
          <div className="h-10 w-3/4 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-32 bg-neutral-200 rounded-full" />
          <div className="h-12 w-48 bg-neutral-200 rounded-xl" />
          <div className="h-px bg-neutral-200" />
          <div className="space-y-3">
            <div className="h-4 w-16 bg-neutral-200 rounded-full" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-14 bg-neutral-200 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="h-14 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
