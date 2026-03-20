'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/axios'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useAuthStore((s) => s.setUser)
  const setTokens = useAuthStore((s) => s.setTokens)
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading)
  const setCart = useCartStore((s) => s.setCart)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      router.replace('/login')
      return
    }

    api.get(`/auth/exchange-code?code=${code}`)
      .then(async ({ data }) => {
        setUser(data.data.user)
        if (data.data.accessToken && data.data.refreshToken) {
          setTokens(data.data.accessToken, data.data.refreshToken)
        }
        try {
          const cartRes = await api.get('/cart')
          setCart(cartRes.data.data.items, cartRes.data.data.total)
        } catch {}
        router.replace('/')
      })
      .catch(() => {
        router.replace('/login')
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
