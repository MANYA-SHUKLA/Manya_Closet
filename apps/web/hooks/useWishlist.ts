'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'
import { useAuthStore } from '@/store/authStore'
import { useWishlistStore } from '@/store/wishlistStore'

export const useWishlist = () => {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get<{ data: IProduct[] }>('/wishlist')
      return data.data
    },
    enabled: !!user,
  })
}

export const useToggleWishlist = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const user = useAuthStore.getState().user
      if (!user) {
        useWishlistStore.getState().toggle(productId)
        return null
      }
      const { data } = await api.post('/wishlist/toggle', { productId })
      return data
    },
    onSuccess: (data) => {
      if (data) qc.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}
