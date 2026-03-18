'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IOrder } from '@manya-closet/types'

export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: IOrder[] }>('/orders')
      return data.data
    },
    staleTime: 2 * 60 * 1000,
  })

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: IOrder }>(`/orders/${id}`)
      return data.data
    },
    enabled: !!id,
  })
