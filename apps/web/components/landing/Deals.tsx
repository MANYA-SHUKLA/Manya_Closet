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
    <div className="flex gap-3">
      {[
        { label: 'Hours', value: timeLeft.h },
        { label: 'Mins', value: timeLeft.m },
        { label: 'Secs', value: timeLeft.s },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-3 min-w-[60px]">
          <span className="text-3xl font-bold text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs text-white/60 mt-1">{label}</span>
        </div>
      ))}
    </div>
  )
}

const DEALS = [
  { tag: 'FLASH SALE', title: 'Summer Dresses', discount: '40% OFF', bg: 'from-rose-500 to-pink-600', href: '/shop?category=dresses' },
  { tag: 'LIMITED', title: 'Accessories Fest', discount: '30% OFF', bg: 'from-violet-500 to-purple-600', href: '/shop?category=accessories' },
  { tag: 'BESTSELLER', title: 'Denim Collection', discount: '25% OFF', bg: 'from-sky-500 to-blue-600', href: '/shop?category=bottoms' },
]

export default function Deals() {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">Deals &amp; Offers</h2>
        <p className="mt-2 text-neutral-500">Limited time — grab before it&apos;s gone</p>
      </div>

      {/* Flash deal banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold text-amber-100 uppercase tracking-wider mb-2">Deal of the Day</p>
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-1">Up to 50% OFF</h3>
          <p className="text-amber-100">On selected premium pieces — today only</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/80 text-sm font-medium">Ends in</p>
          <Countdown targetHours={8} />
          <Link
            href="/shop?sort=popular"
            className="mt-2 px-8 py-3 bg-white text-amber-600 font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Shop the Deal
          </Link>
        </div>
      </div>

      {/* Deal cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {DEALS.map((deal) => (
          <Link
            key={deal.title}
            href={deal.href}
            className={`group relative rounded-2xl bg-gradient-to-br ${deal.bg} p-7 overflow-hidden hover:scale-[1.02] transition-transform duration-200`}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
              {deal.tag}
            </span>
            <h4 className="text-xl font-bold text-white">{deal.title}</h4>
            <p className="text-3xl font-black text-white mt-1">{deal.discount}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-white/80 text-sm group-hover:gap-2 transition-all">
              Shop now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
