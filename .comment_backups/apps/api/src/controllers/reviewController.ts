import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { ReviewModel } from '../models/Review'
import { ProductModel } from '../models/Product'
import { OrderModel } from '../models/Order'
import { AppError } from '../middleware/error'

async function recalcRatings(productId: string) {
  const [result] = await ReviewModel.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  await ProductModel.findByIdAndUpdate(productId, {
    ratings: result ? Math.round(result.avg * 10) / 10 : 0,
    reviewCount: result ? result.count : 0,
  })
}

export const getProductReviews = async (req: Request, res: Response) => {
  const productId = req.params.productId as string
  const reviews = await ReviewModel.find({ product: productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
  res.json({ success: true, data: reviews })
}

export const addReview = async (req: Request, res: Response) => {
  const productId = req.params.productId as string
  const { rating, comment } = req.body
  const userId = (req.user as any)._id

  const existing = await ReviewModel.findOne({ product: productId, user: userId })
  if (existing) throw new AppError('You have already reviewed this product', 400)

  const hasDeliveredOrder = await OrderModel.exists({
    user: userId,
    status: 'delivered',
    'items.product': productId,
  })
  if (!hasDeliveredOrder) {
    throw new AppError('You can only review products you have purchased and received', 403)
  }

  const review = await ReviewModel.create({ product: productId, user: userId, rating, comment })
  await recalcRatings(productId)
  await review.populate('user', 'name avatar')
  res.status(201).json({ success: true, data: review })
}

export const updateReview = async (req: Request, res: Response) => {
  const productId = req.params.productId as string
  const reviewId = req.params.reviewId as string
  const { rating, comment } = req.body
  const userId = (req.user as any)._id

  const review = await ReviewModel.findOne({ _id: reviewId, product: productId })
  if (!review) throw new AppError('Review not found', 404)
  if (!review.user.equals(userId)) throw new AppError('Not authorized', 403)

  if (rating !== undefined) review.rating = rating
  if (comment !== undefined) review.comment = comment
  await review.save()
  await recalcRatings(productId)
  await review.populate('user', 'name avatar')

  res.json({ success: true, data: review })
}

export const deleteReview = async (req: Request, res: Response) => {
  const productId = req.params.productId as string
  const reviewId = req.params.reviewId as string
  const reqUser = req.user as any

  const review = await ReviewModel.findOne({ _id: reviewId, product: productId })
  if (!review) throw new AppError('Review not found', 404)
  if (reqUser.role === 'user' && !review.user.equals(reqUser._id)) {
    throw new AppError('Not authorized', 403)
  }

  await review.deleteOne()
  await recalcRatings(productId)
  res.json({ success: true, message: 'Review deleted' })
}
