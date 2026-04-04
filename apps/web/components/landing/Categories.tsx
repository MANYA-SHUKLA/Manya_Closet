import Link from 'next/link'
const CATEGORIES = [
  {
    name: 'Tops',
    slug: 'tops',
    count: '120+ styles',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSI7B2elbamEzW7MBu0RYenv_URJgsGuuSB039hE56MSl0KPm9lMxJJCxxBlKFDwt3HBLa41JamzumqJ41W94L3JjIstJgo-SGGNrH1cHM',
    color: 'from-rose-900/80',
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    count: '85+ styles',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    color: 'from-violet-900/80',
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    count: '70+ styles',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    color: 'from-sky-900/80',
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    count: '45+ styles',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
    color: 'from-slate-900/80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: '200+ items',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    color: 'from-amber-900/80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    count: '60+ pairs',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    color: 'from-emerald-900/80',
  },
]

export default function Categories() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Collections</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              Shop by Category
            </h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-500 transition-colors group">
            All categories
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/20 to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-base leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                  {cat.name}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{cat.count}</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/0 group-hover:bg-indigo-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
