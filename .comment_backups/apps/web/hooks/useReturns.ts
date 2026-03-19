'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export interface ReturnItem {
  product: string
  name: string
  image: string
  quantity: number
  price: number
  size: string
  color: string
}

export interface ReturnRequest {
  _id: string
  order: { _id: string; total: number; status: string; createdAt: string }
  items: ReturnItem[]
  reason: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  refundAmount: number
  adminNote?: string
  createdAt: string
}

export const useMyReturns = () =>
  useQuery<ReturnRequest[]>({
    queryKey: ['my-returns'],
    queryFn: async () => {
      const { data } = await api.get('/returns')
      return data.data
    },
  })

export const useCreateReturn = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      orderId: string
      items: ReturnItem[]
      reason: string
      description: string
    }) => {
      const { data } = await api.post('/returns', payload)
      return data.data as ReturnRequest
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-returns'] }),
  })
}
