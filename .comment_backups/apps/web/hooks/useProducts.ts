import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'

export const useProducts = (params?: Record<string, string | number>) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params })
      return data as { data: IProduct[]; pagination: { total: number; totalPages: number } }
    },
  })

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: { isFeatured: true, limit: 8 } })
      return data.data as IProduct[]
    },
  })
