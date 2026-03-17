'use client'
import { create } from 'zustand'
import { ICartItem } from '@manya-closet/types'

interface CartState {
  items: ICartItem[]
  total: number
  setCart: (items: ICartItem[], total: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  total: 0,
  setCart: (items, total) => set({ items, total }),
  clear: () => set({ items: [], total: 0 }),
}))
