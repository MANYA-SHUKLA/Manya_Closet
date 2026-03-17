import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-950 flex-col justify-between p-12">
        <Link href="/" className="text-xl font-bold text-white">
          Manya&apos;s <span className="text-amber-500">Closet</span>
        </Link>

        <div className="space-y-4">
          <blockquote className="text-3xl font-bold text-white leading-tight">
            &ldquo;Style is a way to say who you are without having to speak.&rdquo;
          </blockquote>
          <p className="text-neutral-400 text-sm">— Rachel Zoe</p>
        </div>

        <div className="flex gap-6 text-sm text-neutral-600">
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
