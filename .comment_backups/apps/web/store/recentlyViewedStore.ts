'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentProduct {
  _id: string
  name: string
  slug: string
  image: string
  price: number
  discountPrice?: number
  ratings: number
}

interface RecentlyViewedState {
  products: RecentProduct[]
  add: (product: RecentProduct) => void
  clear: () => void
}

const MAX_ITEMS = 8

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],
      add: (product) =>
        set((s) => {
          const filtered = s.products.filter((p) => p._id !== product._id)
          return { products: [product, ...filtered].slice(0, MAX_ITEMS) }
        }),
      clear: () => set({ products: [] }),
    }),
    { name: 'recently-viewed' }
  )
)
