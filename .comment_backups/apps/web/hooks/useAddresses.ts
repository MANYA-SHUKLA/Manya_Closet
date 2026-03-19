'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { ISavedAddress } from '@manya-closet/types'

type AddressPayload = Omit<ISavedAddress, '_id'>

export const useAddresses = () =>
  useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: ISavedAddress[] }>('/users/me/addresses')
      return data.data
    },
  })

export const useCreateAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddressPayload) => api.post('/users/me/addresses', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export const useUpdateAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      api.put(`/users/me/addresses/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export const useDeleteAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/me/addresses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}
