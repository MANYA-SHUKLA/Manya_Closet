'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser } from '@manya-closet/types'

interface AuthState {
  user: IUser | null
  isAuthLoading: boolean
  setUser: (user: IUser | null) => void
  setAuthLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: true,
      setUser: (user) => set({ user }),
      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
