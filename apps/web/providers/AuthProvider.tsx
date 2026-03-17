'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/auth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    authApi.getMe()
      .then(({ data }) => setUser(data.data))
      .catch(() => logout())
  }, [setUser, logout])

  return <>{children}</>
}
