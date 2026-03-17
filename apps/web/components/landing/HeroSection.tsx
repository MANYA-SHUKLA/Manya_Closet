'use client'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-neutral-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15),_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            New Collection — Spring 2026
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Dress Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Story
            </span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
            Curated fashion for women who know who they are. Premium quality, timeless style — delivered to your door.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?isFeatured=true"
              className="px-8 py-4 border border-white/20 hover:border-white/50 text-white rounded-full transition-all duration-200 hover:bg-white/5"
            >
              View Lookbook
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-4">
            {[
              { label: 'Products', value: '500+' },
              { label: 'Happy Customers', value: '12K+' },
              { label: 'Brands', value: '40+' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image placeholder */}
        <div className="hidden lg:block relative">
          <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-white/10 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">Hero Image</span>
          </div>
          {/* Floating badge */}
          <div className="absolute -left-8 bottom-24 bg-white rounded-2xl px-5 py-3 shadow-2xl">
            <p className="text-xs text-neutral-500">Today&apos;s Deal</p>
            <p className="text-sm font-bold text-neutral-900">Up to 40% OFF</p>
          </div>
        </div>
      </div>
    </section>
  )
}
