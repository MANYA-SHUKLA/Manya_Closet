'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { authApi } from '@/lib/auth'
import api from '@/lib/axios'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const setCart = useCartStore((s) => s.setCart)
  const clearCart = useCartStore((s) => s.clear)

  useEffect(() => {
    authApi.getMe()
      .then(async ({ data }) => {
        setUser(data.data)
        
        try {
          const cartRes = await api.get('/cart')
          setCart(cartRes.data.data.items, cartRes.data.data.total)
        } catch {
          
        }
      })
      .catch(() => {
        logout()
        clearCart()
      })
  }, [setUser, logout, setCart, clearCart])

  return <>{children}</>
}
