declare global {
  namespace Express {
    interface User {
      _id: string
      name: string
      email: string
      avatar?: string
      role: 'user' | 'admin'
      isVerified: boolean
      isBlocked: boolean
      googleId?: string
      savedAddresses?: unknown[]
      createdAt: string
      updatedAt: string
    }
  }
}

export {}
