export type UserRole = 'user' | 'admin' | 'superadmin'

export interface IUser {
  _id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface IAuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ILoginPayload {
  email: string
  password: string
}

export interface IRegisterPayload {
  name: string
  email: string
  password: string
}
