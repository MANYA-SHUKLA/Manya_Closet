import Link from 'next/link'

const TEAM = [
  {
    name: 'Manya Shukla',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
    bio: 'Passionate about making premium fashion accessible to every woman. Started Manya\'s Closet with a vision to curate pieces that empower.',
  },
  {
    name: 'Priya Verma',
    role: 'Head of Merchandising',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    bio: 'With 8 years in fashion retail, Priya handpicks every piece that goes into our collection — ensuring quality, style, and value.',
  },
  {
    name: 'Ananya Singh',
    role: 'Customer Experience Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    bio: 'Ananya ensures every customer interaction is delightful — from first browse to unboxing. She\'s the heart of our support team.',
  },
]

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Quality First',
    desc: 'Every product is carefully sourced and quality-checked before it reaches you. No compromises.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Customer Love',
    desc: 'We\'re not happy until you\'re happy. Every interaction, every order, every return — handled with care.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Sustainable Fashion',
    desc: 'We partner with brands that care about people and the planet. Fashion with a conscience.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Fair Pricing',
    desc: 'Premium quality doesn\'t have to mean premium prices. We negotiate hard so you pay less.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">

      <div className="relative bg-[#0f0e1e] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center relative z-10">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Our Story</p>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Dressing Women,<br />
            <em className="text-amber-400 not-italic">Telling Stories</em>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Manya&apos;s Closet was born from a simple belief — every woman deserves to feel confident,
            beautiful, and herself. We curate fashion that speaks before you do.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Who We Are</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              More than a fashion store
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2024 by Manya Shukla, Manya&apos;s Closet started as a personal mission to make
                curated, high-quality fashion accessible to women across India — without the premium markup.
              </p>
              <p>
                We carefully select each piece in our collection, working directly with trusted brands and
                artisans to bring you styles that are timeless yet contemporary. From casual everyday wear
                to statement pieces for special occasions, we have something for every story.
              </p>
              <p>
                Today, we serve over 12,000 happy customers across India and continue to grow — driven by
                our love for fashion and our commitment to your satisfaction.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
              alt="Fashion"
              className="rounded-2xl object-cover h-64 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80"
              alt="Style"
              className="rounded-2xl object-cover h-64 w-full mt-8"
            />
          </div>
        </div>
      </div>

      <div className="bg-indigo-500">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '500+', label: 'Products' },
            { value: '12K+', label: 'Happy Customers' },
            { value: '50+', label: 'Brands' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>{value}</p>
              <p className="text-indigo-200 text-sm uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">What We Stand For</p>
          <h2 className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Our Values
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-indigo-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">The People</p>
            <h2 className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              Meet the Team
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, image, bio }) => (
              <div key={name} className="text-center">
                <img src={image} alt={name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-100" />
                <h3 className="font-bold text-gray-900">{name}</h3>
                <p className="text-indigo-500 text-sm mb-3">{role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
          Ready to find your style?
        </h2>
        <p className="text-gray-500 mb-8">Explore our latest collection and discover pieces you&apos;ll love.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition-all hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
        >
          Shop the Collection
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

    </div>
  )
}
