'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'
import { useAuthStore } from '@/store/authStore'

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
    mutationFn: (productId: string) => api.post('/wishlist/toggle', { productId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}
