import { IUser } from '@manya-closet/types'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export {}
