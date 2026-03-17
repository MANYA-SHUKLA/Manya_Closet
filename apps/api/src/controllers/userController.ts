import { Request, Response } from 'express'
import { UserModel } from '../models/User'

export const getMe = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id)
  res.json({ success: true, data: user })
}

export const updateProfile = async (req: Request, res: Response) => {
  const { name, avatar } = req.body
  const user = await UserModel.findByIdAndUpdate(req.user!._id, { name, avatar }, { new: true })
  res.json({ success: true, data: user })
}

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 })
  res.json({ success: true, data: users })
}
