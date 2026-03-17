'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ICartItem } from '@manya-closet/types'

interface CartState {
  items: ICartItem[]
  total: number
  setCart: (items: ICartItem[], total: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      setCart: (items, total) => set({ items, total }),
      clear: () => set({ items: [], total: 0 }),
    }),
    { name: 'cart-store' }
  )
)
