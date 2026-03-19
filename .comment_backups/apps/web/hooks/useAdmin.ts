'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'

export interface AdminOrder {
  _id: string
  user: { _id: string; name: string; email: string }
  items: { name: string; quantity: number; price: number; image: string }[]
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: { fullName: string; city: string; state: string }
  createdAt: string
}

export interface DashboardData {
  stats: { totalSales: number; totalOrders: number; totalUsers: number; totalProducts: number }
  salesByDay: { _id: string; sales: number; count: number }[]
  ordersByStatus: { _id: string; count: number }[]
  recentOrders: AdminOrder[]
}

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardData }>('/admin/dashboard')
      return data.data
    },
    staleTime: 60_000,
  })

export const useAdminProducts = (params?: { search?: string; page?: number; status?: string }) =>
  useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const { data } = await api.get<{
        data: IProduct[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }>('/admin/products', { params })
      return data
    },
    staleTime: 30_000,
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: unknown) => api.post('/products', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.put(`/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}

export const useAdminOrders = (params?: { page?: number; status?: string }) =>
  useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const { data } = await api.get<{
        data: AdminOrder[]
        pagination: { total: number; page: number; limit: number; pages: number }
      }>('/orders', { params })
      return data
    },
    staleTime: 30_000,
  })

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isVerified: boolean
  isBlocked: boolean
  googleId?: string
  createdAt: string
}

export const useAdminUsers = (params?: { search?: string; page?: number; role?: string; blocked?: string }) =>
  useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const { data } = await api.get<{
        data: AdminUser[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }>('/admin/users', { params })
      return data
    },
    staleTime: 30_000,
  })

export const useToggleBlockUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/block`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export interface AdminCoupon {
  _id: string
  code: string
  type: 'percentage' | 'flat'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
  createdAt: string
}

export const useAdminCoupons = () =>
  useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data } = await api.get<{ data: AdminCoupon[] }>('/coupons')
      return data.data
    },
    staleTime: 30_000,
  })

export const useCreateCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: unknown) => api.post('/coupons', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  })
}

export const useUpdateCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => api.put(`/coupons/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  })
}

export const useToggleCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/coupons/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  })
}

export const useDeleteCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
  })
}
