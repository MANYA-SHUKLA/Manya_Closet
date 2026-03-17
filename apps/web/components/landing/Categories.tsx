import Link from 'next/link'

const CATEGORIES = [
  { name: 'Tops', slug: 'tops', emoji: '👚', count: '120+ styles' },
  { name: 'Dresses', slug: 'dresses', emoji: '👗', count: '85+ styles' },
  { name: 'Bottoms', slug: 'bottoms', emoji: '👖', count: '70+ styles' },
  { name: 'Outerwear', slug: 'outerwear', emoji: '🧥', count: '45+ styles' },
  { name: 'Accessories', slug: 'accessories', emoji: '👜', count: '200+ items' },
  { name: 'Footwear', slug: 'footwear', emoji: '👠', count: '60+ pairs' },
]

export default function Categories() {
  return (
    <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">Shop by Category</h2>
        <p className="mt-3 text-neutral-500">Find exactly what you&apos;re looking for</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-neutral-50 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all duration-200"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
              {cat.emoji}
            </span>
            <div className="text-center">
              <p className="font-semibold text-neutral-800 text-sm">{cat.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
