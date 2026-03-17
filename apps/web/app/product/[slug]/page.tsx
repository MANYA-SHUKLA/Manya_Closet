import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ImageCarousel from '@/components/product/ImageCarousel'
import VariantSelector from '@/components/product/VariantSelector'
import AddToCartButton from '@/components/product/AddToCartButton'
import ReviewSection from '@/components/product/ReviewSection'
import ProductDetailClient from '@/components/product/ProductDetailClient'

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug)
  if (!product) return { title: "Product Not Found — Manya's Closet" }
  return {
    title: `${product.name} — Manya's Closet`,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.images[0]] },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug)
  if (!product) notFound()

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <a href="/" className="hover:text-neutral-600">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-neutral-600">Shop</a>
          <span>/</span>
          <a href={`/shop?category=${product.category}`} className="hover:text-neutral-600 capitalize">
            {product.category}
          </a>
          <span>/</span>
          <span className="text-neutral-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left — Images */}
          <div>
            <ImageCarousel images={product.images} />
          </div>

          {/* Right — Info */}
          <div className="space-y-6">
            {/* Brand + badges */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                {product.brand}
              </span>
              {product.isFeatured && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  Featured
                </span>
              )}
              {discountPct && (
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">
                  -{discountPct}% OFF
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_: unknown, i: number) => (
                    <span key={i} className={i < Math.round(product.ratings) ? 'text-amber-400' : 'text-neutral-200'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-neutral-600 font-medium">{product.ratings.toFixed(1)}</span>
                <a href="#reviews" className="text-sm text-amber-600 hover:underline">
                  {product.reviewCount} reviews
                </a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-neutral-900">
                ₹{(product.discountPrice ?? product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-neutral-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
              {discountPct && (
                <span className="text-emerald-600 text-sm font-semibold">
                  Save ₹{(product.price - product.discountPrice).toLocaleString()}
                </span>
              )}
            </div>

            <div className="h-px bg-neutral-100" />

            {/* Interactive client section */}
            <Suspense fallback={<div className="h-48 animate-pulse bg-neutral-50 rounded-2xl" />}>
              <ProductDetailClient product={product} />
            </Suspense>

            <div className="h-px bg-neutral-100" />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">About this product</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', text: 'Free shipping above ₹999' },
                { icon: '↩️', text: '7-day easy returns' },
                { icon: '🔒', text: 'Secure checkout' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xl mb-1">{icon}</span>
                  <p className="text-xs text-neutral-500 leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews">
          <Suspense fallback={null}>
            <ReviewSection
              productId={product._id}
              ratings={product.ratings}
              reviewCount={product.reviewCount}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
