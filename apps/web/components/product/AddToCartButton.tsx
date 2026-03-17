'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist'
import { IProduct } from '@manya-closet/types'

interface Props {
  product: IProduct
  selectedSize: string
  selectedColor: string
  stock: number
}

export default function AddToCartButton({ product, selectedSize, selectedColor, stock }: Props) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const qc = useQueryClient()
  const { data: wishlist } = useWishlist()
  const { mutate: toggleWishlist } = useToggleWishlist()

  const isWishlisted = wishlist?.some((p) => p._id === product._id)

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: () =>
      api.post('/cart', {
        productId: product._id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      }),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      useCartStore.getState().setCart(data.data.items, data.data.total)
    },
  })

  const handleAddToCart = () => {
    if (!user) return router.push(`/login?redirect=/product/${product.slug}`)
    addToCart()
  }

  const handleWishlist = () => {
    if (!user) return router.push('/login')
    toggleWishlist(product._id)
  }

  const outOfStock = stock === 0

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToCart}
        disabled={outOfStock || isPending}
        className={`flex-1 py-4 rounded-2xl font-semibold text-sm transition-all ${
          outOfStock
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-neutral-900 hover:bg-neutral-700 text-white active:scale-95 shadow-lg shadow-neutral-900/20'
        } disabled:opacity-60`}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adding…
          </span>
        ) : outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <button
        onClick={handleWishlist}
        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-50 border-rose-200 text-rose-500'
            : 'border-neutral-200 text-neutral-400 hover:border-rose-200 hover:text-rose-400'
        }`}
      >
        <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  )
}
