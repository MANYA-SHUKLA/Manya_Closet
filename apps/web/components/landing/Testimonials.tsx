'use client'
import { useState } from 'react'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: "Manya's Closet has completely transformed my wardrobe. The quality is unreal and delivery was super fast. Definitely my go-to for all things fashion!",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tag: 'Verified Buyer',
  },
  {
    name: 'Ananya Verma',
    location: 'Delhi',
    rating: 5,
    text: "I ordered 3 dresses and each one fit perfectly. The return process was smooth and customer support was incredibly helpful. 10/10 would recommend.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tag: 'Verified Buyer',
  },
  {
    name: 'Ritika Nair',
    location: 'Bangalore',
    rating: 5,
    text: "Finally a fashion brand that actually cares about their customers. The packaging was gorgeous, the clothes were even better. Already placed my second order!",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    tag: 'Repeat Customer',
  },
  {
    name: 'Sneha Joshi',
    location: 'Pune',
    rating: 5,
    text: "Love the curation — every piece feels intentional and high-quality. The summer collection was exactly what I needed. Can't wait for the next drop!",
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    tag: 'Style Enthusiast',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const TRUST_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 10a2 2 0 002 2h8a2 2 0 002-2l1-10M10 12v4m4-4v4" />
      </svg>
    ),
    title: 'Free Shipping',
    desc: 'On orders above ₹999',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Easy Returns',
    desc: '7-day return policy',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Payments',
    desc: 'Razorpay encrypted',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: '4.9/5 Rating',
    desc: 'From 12,000+ reviews',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-24 px-6 lg:px-8 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Loved by Thousands
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Real reviews from real shoppers across India
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-16">

          <div className="lg:col-span-3 bg-[#0f0e1e] rounded-3xl p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-6 right-8 text-[8rem] leading-none font-serif text-white/5 select-none pointer-events-none">"</div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <Stars count={TESTIMONIALS[active].rating} />
                <span className="text-indigo-300/60 text-xs uppercase tracking-wider">
                  {TESTIMONIALS[active].tag}
                </span>
              </div>
              <blockquote className="text-xl lg:text-2xl text-white font-light leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                &ldquo;{TESTIMONIALS[active].text}&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={TESTIMONIALS[active].image}
                alt={TESTIMONIALS[active].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400/40"
              />
              <div>
                <p className="text-white font-semibold">{TESTIMONIALS[active].name}</p>
                <p className="text-gray-500 text-sm">{TESTIMONIALS[active].location}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                  active === i
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className={`w-11 h-11 rounded-full object-cover flex-shrink-0 transition-all ${
                    active === i ? 'ring-2 ring-indigo-400 ring-offset-2' : ''
                  }`}
                />
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${active === i ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <Stars count={t.rating} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-4">
                {icon}
              </div>
              <p className="text-gray-900 font-semibold text-sm mb-1">{title}</p>
              <p className="text-gray-400 text-xs">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
