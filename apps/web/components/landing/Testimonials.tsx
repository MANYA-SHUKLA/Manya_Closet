'use client'
import { useState } from 'react'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: "Manya's Closet has completely transformed my wardrobe. The quality is unreal and delivery was super fast. Definitely my go-to for all things fashion!",
    avatar: 'PS',
  },
  {
    name: 'Ananya Verma',
    location: 'Delhi',
    rating: 5,
    text: "I ordered 3 dresses and each one fit perfectly. The return process was smooth and customer support was incredibly helpful. 10/10 would recommend.",
    avatar: 'AV',
  },
  {
    name: 'Ritika Nair',
    location: 'Bangalore',
    rating: 5,
    text: "Finally a fashion brand that actually cares about their customers. The packaging was gorgeous, the clothes were even better. Already placed my second order!",
    avatar: 'RN',
  },
  {
    name: 'Sneha Joshi',
    location: 'Pune',
    rating: 5,
    text: "Love the curation — every piece feels intentional and high-quality. The summer collection was exactly what I needed. Can't wait for the next drop!",
    avatar: 'SJ',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-20 px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">What Our Customers Say</h2>
          <p className="mt-2 text-neutral-400">Real reviews from real shoppers</p>
        </div>

        {/* Featured review */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <Stars count={TESTIMONIALS[active].rating} />
          </div>
          <blockquote className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-6">
            &ldquo;{TESTIMONIALS[active].text}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
              {TESTIMONIALS[active].avatar}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{TESTIMONIALS[active].name}</p>
              <p className="text-neutral-500 text-xs">{TESTIMONIALS[active].location}</p>
            </div>
          </div>
        </div>

        {/* Selector dots */}
        <div className="flex justify-center gap-3 mb-8">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm ${
                active === i
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-white/10 text-neutral-500 hover:border-white/30'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">
                {t.avatar}
              </span>
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 border-t border-white/10 pt-12">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay encrypted' },
            { icon: '⭐', title: '4.9/5 Rating', desc: 'From 12,000+ reviews' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="text-3xl">{icon}</span>
              <p className="text-white font-semibold mt-2 text-sm">{title}</p>
              <p className="text-neutral-500 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
