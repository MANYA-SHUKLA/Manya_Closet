'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

interface CartResponse {
  data: {
    items: {
      _id: string
      product: { _id: string; name: string; images: string[]; isActive: boolean }
      name: string
      image: string
      price: number
      quantity: number
      size: string
      color: string
    }[]
    total: number
  }
}

export const useCart = () => {
  const user = useAuthStore((s) => s.user)
  const setCart = useCartStore((s) => s.setCart)

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get<CartResponse>('/cart')
      setCart(data.data.items as never, data.data.total)
      return data.data
    },
    enabled: !!user,
    staleTime: 30_000,
  })
}

export interface AddToCartInput {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export const useAddToCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const user = useAuthStore.getState().user
      if (!user) {
        useCartStore.getState().addItem({
          product: input.productId,
          name: input.name,
          image: input.image,
          price: input.price,
          quantity: input.quantity,
          size: input.size,
          color: input.color,
        })
        return null
      }
      const { data } = await api.post('/cart', {
        productId: input.productId,
        quantity: input.quantity,
        size: input.size,
        color: input.color,
      })
      return data.data as { items: never[]; total: number }
    },
    onSuccess: (cart) => {
      if (cart) {
        qc.setQueryData(['cart'], cart)
        useCartStore.getState().setCart(cart.items, cart.total)
      }
    },
  })
}

export const useUpdateCartItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const user = useAuthStore.getState().user
      if (!user) {
        useCartStore.getState().updateItemQty(itemId, quantity)
        return null
      }
      const { data } = await api.put(`/cart/${itemId}`, { quantity })
      return data.data as { items: never[]; total: number }
    },
    onSuccess: (cart) => {
      if (cart) {
        qc.setQueryData(['cart'], cart)
        useCartStore.getState().setCart(cart.items, cart.total)
      }
    },
  })
}

export const useRemoveCartItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (itemId: string) => {
      const user = useAuthStore.getState().user
      if (!user) {
        useCartStore.getState().removeItem(itemId)
        return null
      }
      const { data } = await api.delete(`/cart/${itemId}`)
      return data.data as { items: never[]; total: number }
    },
    onSuccess: (cart) => {
      if (cart) {
        qc.setQueryData(['cart'], cart)
        useCartStore.getState().setCart(cart.items, cart.total)
      }
    },
  })
}

export const useClearCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const user = useAuthStore.getState().user
      if (!user) {
        useCartStore.getState().clear()
        return
      }
      await api.delete('/cart')
    },
    onSuccess: () => {
      qc.setQueryData(['cart'], { data: { items: [], total: 0 } })
      useCartStore.getState().clear()
    },
  })
}
