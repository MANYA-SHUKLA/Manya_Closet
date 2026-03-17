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

export const useUpdateCartItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/${itemId}`, { quantity }),
    onSuccess: ({ data }) => {
      qc.setQueryData(['cart'], { data: data.data })
      useCartStore.getState().setCart(data.data.items, data.data.total)
    },
  })
}

export const useRemoveCartItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/${itemId}`),
    onSuccess: ({ data }) => {
      qc.setQueryData(['cart'], { data: data.data })
      useCartStore.getState().setCart(data.data.items, data.data.total)
    },
  })
}

export const useClearCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('/cart'),
    onSuccess: () => {
      qc.setQueryData(['cart'], { data: { items: [], total: 0 } })
      useCartStore.getState().clear()
    },
  })
}
