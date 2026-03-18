export default function QuoteSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e1e]/95 via-[#0f0e1e]/75 to-[#0f0e1e]/40" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="max-w-2xl">
          {/* Decorative quote mark */}
          <div className="text-[8rem] leading-none font-serif text-indigo-400/30 select-none mb-[-2rem]">&ldquo;</div>

          <blockquote
            className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
          >
            Style is a way to say who you are without having to speak.
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-amber-400" />
            <p className="text-amber-400 font-semibold tracking-widest text-sm uppercase">Rachel Zoe</p>
          </div>
        </div>
      </div>
    </section>
  )
}
