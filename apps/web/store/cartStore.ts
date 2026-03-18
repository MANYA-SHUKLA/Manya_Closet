'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LocalCartItem {
  _id: string
  product: string | { _id: string; name: string; images: string[]; isActive: boolean }
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

interface CartState {
  items: LocalCartItem[]
  total: number
  setCart: (items: LocalCartItem[], total: number) => void
  addItem: (item: Omit<LocalCartItem, '_id'>) => void
  removeItem: (id: string) => void
  updateItemQty: (id: string, quantity: number) => void
  clear: () => void
}

const calcTotal = (items: LocalCartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,

      setCart: (items, total) => set({ items, total }),

      addItem: (item) =>
        set((s) => {
          const existingIdx = s.items.findIndex(
            (i) =>
              typeof i.product === 'string' &&
              typeof item.product === 'string' &&
              i.product === item.product &&
              i.size === item.size &&
              i.color === item.color
          )
          const updated = [...s.items]
          if (existingIdx >= 0) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: updated[existingIdx].quantity + item.quantity,
            }
          } else {
            updated.push({ ...item, _id: `guest-${Math.random().toString(36).slice(2)}` })
          }
          return { items: updated, total: calcTotal(updated) }
        }),

      removeItem: (id) =>
        set((s) => {
          const updated = s.items.filter((i) => i._id !== id)
          return { items: updated, total: calcTotal(updated) }
        }),

      updateItemQty: (id, quantity) =>
        set((s) => {
          const updated = s.items.map((i) => (i._id === id ? { ...i, quantity } : i))
          return { items: updated, total: calcTotal(updated) }
        }),

      clear: () => set({ items: [], total: 0 }),
    }),
    { name: 'cart-store' }
  )
)
