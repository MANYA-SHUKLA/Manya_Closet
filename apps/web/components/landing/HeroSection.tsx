'use client'
import Link from 'next/link'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90'
const HERO_IMAGE_2 = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90'

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex overflow-hidden bg-[#0f0e1e]">

      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Subtle indigo glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left content */}
      <div className="relative z-10 flex flex-col justify-center px-8 lg:px-16 xl:px-24 max-w-3xl pt-12 pb-20 lg:pb-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-12 bg-indigo-400" />
          <span className="text-indigo-300 text-xs font-semibold uppercase tracking-[0.2em]">Spring / Summer 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-white mb-8"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
          Dress<br />
          <em className="text-amber-400 not-italic">Your</em><br />
          Story.
        </h1>

        <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-10 max-w-sm">
          Curated fashion for women who know who they are. Premium quality, timeless style — delivered to your door.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16">
          <Link
            href="/shop"
            className="group flex items-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
          >
            Shop Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/shop?isFeatured=true"
            className="px-8 py-4 border border-white/15 hover:border-indigo-400/50 text-white/80 hover:text-white rounded-full transition-all duration-300 hover:bg-white/5 text-sm"
          >
            View Lookbook
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10">
          {[
            { value: '500+', label: 'Products' },
            { value: '12K+', label: 'Happy Customers' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>{value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — editorial image grid */}
      <div className="hidden lg:flex absolute right-0 top-0 h-full w-[48%] gap-3 p-4">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          <img
            src={HERO_IMAGE}
            alt="Fashion editorial"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e1e] via-transparent to-transparent" />
          {/* Floating card */}
          <div className="absolute bottom-10 left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3.5">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">Today&apos;s Deal</p>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>Up to 50% Off</p>
          </div>
          {/* Top right badge */}
          <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-indigo-500 flex flex-col items-center justify-center text-white font-bold shadow-xl shadow-indigo-500/30">
            <span className="text-xs uppercase tracking-wider">New</span>
            <span className="text-lg leading-none">In</span>
          </div>
        </div>

        {/* Secondary image strip */}
        <div className="w-44 flex-shrink-0 flex flex-col gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden">
            <img src={HERO_IMAGE_2} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="h-36 rounded-2xl overflow-hidden bg-amber-500 flex flex-col items-center justify-center text-black font-bold gap-1 text-center px-3">
            <span className="text-3xl font-black" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>40%</span>
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Sale on<br />selected items</span>
          </div>
        </div>
      </div>

      {/* Mobile image */}
      <div className="lg:hidden absolute inset-0 -z-0">
        <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover object-top opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0e1e]/60 via-[#0f0e1e]/80 to-[#0f0e1e]" />
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 lg:left-16 lg:translate-x-0">
        <span className="text-white text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}
