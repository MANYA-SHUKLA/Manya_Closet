'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/auth'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser)
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await authApi.getMe()
      setUser(data.data)
      return data.data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setUser(data.data.user)
      qc.setQueryData(['me'], data.data.user)
      router.push('/')
    },
  })
}

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      setUser(data.data.user)
      router.push('/')
    },
  })
}

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      qc.clear()
      router.push('/login')
    },
  })
}

export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) })

export const useResetPassword = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => router.push('/login?reset=success'),
  })
}

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; avatar?: string }) => api.put('/users/me', data),
    onSuccess: async () => {
      const { data } = await authApi.getMe()
      setUser(data.data)
      qc.setQueryData(['me'], data.data)
    },
  })
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      api.put('/users/me/password', { currentPassword, newPassword }),
  })
