import api from './axios'
import { IUser } from '@manya-closet/types'

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; data: { user: IUser } }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: { user: IUser } }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  getMe: () =>
    api.get<{ success: boolean; data: IUser }>('/users/me'),

  googleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  },
}
