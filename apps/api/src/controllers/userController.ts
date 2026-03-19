import { Request, Response } from 'express'
import { UserModel } from '../models/User'
import { AppError } from '../middleware/error'

export const getMe = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id)
  res.json({ success: true, data: user })
}

export const updateProfile = async (req: Request, res: Response) => {
  const { name, avatar } = req.body
  const user = await UserModel.findByIdAndUpdate(req.user!._id, { name, avatar }, { new: true })
  res.json({ success: true, data: user })
}

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  const user = await UserModel.findById(req.user!._id).select('+password')
  if (!user) throw new AppError('User not found', 404)
  if (user.googleId) throw new AppError('Password cannot be changed for Google-linked accounts', 400)
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) throw new AppError('Current password is incorrect', 401)
  user.password = newPassword
  await user.save()
  res.json({ success: true, message: 'Password updated successfully' })
}

export const getAddresses = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id).select('savedAddresses')
  res.json({ success: true, data: user?.savedAddresses ?? [] })
}

export const addAddress = async (req: Request, res: Response) => {
  const { isDefault, ...rest } = req.body
  if (isDefault) {
    await UserModel.updateOne(
      { _id: req.user!._id },
      { $set: { 'savedAddresses.$[].isDefault': false } },
    )
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user!._id,
    { $push: { savedAddresses: { ...rest, isDefault: isDefault ?? false } } },
    { new: true, select: 'savedAddresses' },
  )
  res.status(201).json({ success: true, data: user?.savedAddresses ?? [] })
}

export const updateAddress = async (req: Request, res: Response) => {
  const { isDefault, ...rest } = req.body
  if (isDefault) {
    await UserModel.updateOne(
      { _id: req.user!._id },
      { $set: { 'savedAddresses.$[].isDefault': false } },
    )
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: req.user!._id, 'savedAddresses._id': req.params.addressId },
    { $set: { 'savedAddresses.$': { _id: req.params.addressId, ...rest, isDefault: isDefault ?? false } } },
    { new: true, select: 'savedAddresses' },
  )
  if (!user) throw new AppError('Address not found', 404)
  res.json({ success: true, data: user.savedAddresses })
}

export const deleteAddress = async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user!._id,
    { $pull: { savedAddresses: { _id: req.params.addressId } } },
    { new: true, select: 'savedAddresses' },
  )
  res.json({ success: true, data: user?.savedAddresses ?? [] })
}

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 })
  res.json({ success: true, data: users })
}
