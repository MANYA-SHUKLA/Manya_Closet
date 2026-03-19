'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/auth'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

async function mergeGuestData(qc: ReturnType<typeof useQueryClient>) {
  const localItems = useCartStore.getState().items
  if (localItems.length > 0) {
    try {
      const cartItems = localItems.map((item) => ({
        productId: typeof item.product === 'string' ? item.product : (item.product as { _id: string })._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))
      const { data } = await api.post('/cart/merge', { items: cartItems })
      // Pre-populate cart cache so useCart reads this immediately without a GET /cart race
      qc.setQueryData(['cart'], data.data)
      useCartStore.getState().setCart(data.data.items, data.data.total)
    } catch {
      // merge failed — leave local cart intact, user keeps seeing their items
    }
  }

  const localWishlistIds = useWishlistStore.getState().ids
  if (localWishlistIds.length > 0) {
    try {
      await api.post('/wishlist/sync', { productIds: localWishlistIds })
    } catch {
      // ignore sync errors
    }
    useWishlistStore.getState().clear()
    qc.invalidateQueries({ queryKey: ['wishlist'] })
  }
}

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
    onSuccess: async ({ data }) => {
      qc.setQueryData(['me'], data.data.user)
      await mergeGuestData(qc)   // merge BEFORE setUser so useCart doesn't race with merge
      setUser(data.data.user)
      const redirect = new URLSearchParams(window.location.search).get('redirect') ?? '/'
      router.push(redirect)
    },
  })
}

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async ({ data }) => {
      qc.setQueryData(['me'], data.data.user)
      await mergeGuestData(qc)
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
