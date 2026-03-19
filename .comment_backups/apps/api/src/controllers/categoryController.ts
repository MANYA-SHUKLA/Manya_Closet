import { Request, Response } from 'express'
import { CategoryModel } from '../models/Category'
import { ProductModel } from '../models/Product'
import { AppError } from '../middleware/error'

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await CategoryModel.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('parent', 'name slug')

  const slugs = categories.map((c) => c.slug)
  const counts = await ProductModel.aggregate([
    { $match: { isActive: true, category: { $in: slugs } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ])
  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]))

  const data = categories.map((c) => ({
    ...c.toObject(),
    productCount: countMap[c.slug] ?? 0,
  }))

  res.json({ success: true, data })
}

export const getCategory = async (req: Request, res: Response) => {
  const category = await CategoryModel.findOne({ slug: req.params.slug, isActive: true })
    .populate('parent', 'name slug')
  if (!category) throw new AppError('Category not found', 404)
  res.json({ success: true, data: category })
}

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, image, parent, sortOrder } = req.body
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const category = await CategoryModel.create({ name, slug, description, image, parent: parent || null, sortOrder })
  res.status(201).json({ success: true, data: category })
}

export const updateCategory = async (req: Request, res: Response) => {
  const { name, description, image, parent, sortOrder, isActive } = req.body
  const update: Record<string, unknown> = { description, image, parent: parent || null, sortOrder, isActive }
  if (name) {
    update.name = name
    update.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!category) throw new AppError('Category not found', 404)
  res.json({ success: true, data: category })
}

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await CategoryModel.findByIdAndUpdate(
    req.params.id, { isActive: false }, { new: true }
  )
  if (!category) throw new AppError('Category not found', 404)
  res.json({ success: true, message: 'Category deactivated' })
}
