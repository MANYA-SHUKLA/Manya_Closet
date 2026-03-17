'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser } from '@manya-closet/types'

interface AuthState {
  user: IUser | null
  setUser: (user: IUser | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-store' }
  )
)
