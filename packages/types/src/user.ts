export type UserRole = 'user' | 'admin' | 'superadmin'

export interface ISavedAddress {
  _id: string
  label: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface IUser {
  _id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  googleId?: string
  savedAddresses?: ISavedAddress[]
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
