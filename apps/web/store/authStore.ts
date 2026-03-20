'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser } from '@manya-closet/types'

interface AuthState {
  user: IUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthLoading: boolean
  setUser: (user: IUser | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setAuthLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthLoading: true,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
)
