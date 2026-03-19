'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IOrder } from '@manya-closet/types'

export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: IOrder[] }>('/orders/my')
      return data.data
    },
    staleTime: 0,
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

export const useRequestReturn = (orderId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reason: string) =>
      api.patch(`/orders/${orderId}/return`, { reason }),
    onSuccess: ({ data }) => {
      qc.setQueryData(['order', orderId], data.data)
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
