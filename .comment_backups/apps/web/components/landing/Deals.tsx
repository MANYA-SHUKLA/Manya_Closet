'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function Countdown({ targetHours = 12 }: { targetHours?: number }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const end = Date.now() + targetHours * 60 * 60 * 1000
    const tick = () => {
      const diff = Math.max(0, end - Date.now())
      setTimeLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetHours])

  return (
    <div className="flex gap-2">
      {[
        { label: 'HRS', value: timeLeft.h },
        { label: 'MIN', value: timeLeft.m },
        { label: 'SEC', value: timeLeft.s },
      ].map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-2xl font-bold text-white tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{label}</span>
          </div>
          {i < 2 && <span className="text-white/40 text-xl font-bold mb-5">:</span>}
        </div>
      ))}
    </div>
  )
}

const DEALS = [
  {
    tag: 'Flash Sale',
    title: 'Summer Dresses',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85',
    href: '/shop?category=dresses&sale=true',
  },
  {
    tag: 'Limited',
    title: 'Accessories',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=85',
    href: '/shop?category=accessories&sale=true',
  },
  {
    tag: 'Bestseller',
    title: 'Denim & Bottoms',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85',
    href: '/shop?category=bottoms&sale=true',
  },
]

export default function Deals() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#0f0e1e]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Limited Time</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Deals & Offers
          </h2>
        </div>

        <div className="relative rounded-3xl overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85"
            alt="Deal of the day"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

          <div className="relative z-10 px-10 py-14 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">Deal of the Day</span>
              </div>
              <h3 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                Up to 50% Off
              </h3>
              <p className="text-white/60 text-base lg:text-lg">On selected premium pieces — today only</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Ends in</p>
              <Countdown targetHours={8} />
              <Link
                href="/shop?sort=popular&sale=true"
                className="px-10 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 text-sm"
              >
                Shop the Deal
              </Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {DEALS.map((deal) => (
            <Link
              key={deal.title}
              href={deal.href}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider border border-white/20">
                  {deal.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/70 text-sm mb-1">{deal.title}</p>
                <p className="text-3xl font-bold text-amber-400 mb-4"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                  {deal.discount}
                </p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all">
                  Shop now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
