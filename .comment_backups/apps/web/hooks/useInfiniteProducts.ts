'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  minRating?: string
  sort?: string
  search?: string
  isFeatured?: string
  sale?: string
}

export interface ProductsPage {
  data: IProduct[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

const LIMIT = 12

export const useInfiniteProducts = (filters: ProductFilters) =>
  useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { ...filters, page: pageParam, limit: LIMIT }
      const { data } = await api.get<ProductsPage>('/products', { params })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages
        ? last.pagination.page + 1
        : undefined,
  })
