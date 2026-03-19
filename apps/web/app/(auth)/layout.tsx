import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left — image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"
          alt="Fashion"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        {/* Content over image */}
        <Link href="/" className="relative text-xl font-bold text-white z-10">
          Manya&apos;s <span className="text-amber-400">Closet</span>
        </Link>

        <div className="relative z-10 space-y-4">
          <blockquote className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
            &ldquo;Style is a way to say who you are without having to speak.&rdquo;
          </blockquote>
          <p className="text-neutral-300 text-sm">— Rachel Zoe</p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm text-white/70">
          <span>500+ Products</span>
          <span>12K+ Customers</span>
          <span>4.9★ Rating</span>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden text-lg font-bold text-neutral-900 block mb-8">
            Manya&apos;s <span className="text-amber-500">Closet</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
