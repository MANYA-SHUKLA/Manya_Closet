import { Request, Response } from 'express'
import { ProductModel } from '../models/Product'
import { ReviewModel } from '../models/Review'
import { AppError } from '../middleware/error'
import { IProductFilters } from '@manya-closet/types'

export const getProducts = async (req: Request, res: Response) => {
  const {
    category, brand, minPrice, maxPrice, size, color,
    search, page = '1', limit = '12', sort, isFeatured, sale
  } = req.query as Record<string, string>

  const filters: Record<string, unknown> = { isActive: true }
  if (category) filters.category = category
  if (isFeatured === 'true') filters.isFeatured = true
  if (sale === 'true') filters.discountPrice = { $exists: true }
  if (brand) filters.brand = brand
  if (minPrice || maxPrice) filters.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) }
  if (size) filters['variants.size'] = size
  if (color) filters['variants.color'] = color
  if (search) filters.$text = { $search: search }

  const sortMap: Record<string, Record<string, number>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    popular: { reviewCount: -1 },
  }

  const pageNum = Math.max(1, +page)
  const limitNum = Math.min(50, +limit)
  const skip = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    ProductModel.find(filters)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNum),
    ProductModel.countDocuments(filters),
  ])

  res.json({
    success: true,
    data: products,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  })
}

export const getProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ slug: req.params.slug, isActive: true })
  if (!product) throw new AppError('Product not found', 404)
  res.json({ success: true, data: product })
}

export const createProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.create(req.body)
  res.status(201).json({ success: true, data: product })
}

export const updateProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!product) throw new AppError('Product not found', 404)
  res.json({ success: true, data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
  await ProductModel.findByIdAndUpdate(req.params.id, { isActive: false })
  res.json({ success: true, message: 'Product deleted' })
}

export const getProductReviews = async (req: Request, res: Response) => {
  const reviews = await ReviewModel.find({ product: req.params.id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
  res.json({ success: true, data: reviews })
}

export const addReview = async (req: Request, res: Response) => {
  const { rating, comment } = req.body
  const existing = await ReviewModel.findOne({ product: req.params.id, user: req.user!._id })
  if (existing) throw new AppError('Already reviewed', 400)

  const review = await ReviewModel.create({ product: req.params.id, user: req.user!._id, rating, comment })

  // Update product rating
  const allReviews = await ReviewModel.find({ product: req.params.id })
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
  await ProductModel.findByIdAndUpdate(req.params.id, { ratings: avg, reviewCount: allReviews.length })

  res.status(201).json({ success: true, data: review })
}
