import { Request, Response } from 'express'
import { ProductModel } from '../models/Product'
import { ReviewModel } from '../models/Review'
import { AppError } from '../middleware/error'
import { IProductFilters } from '@manya-closet/types'

export const getProducts = async (req: Request, res: Response) => {
  const {
    category, brand, minPrice, maxPrice, size, color,
    search, page = '1', limit = '12', sort, isFeatured, sale, minRating
  } = req.query as Record<string, string>

  const filters: Record<string, unknown> = { isActive: true }
  if (category) filters.category = { $in: category.split(',') }
  if (isFeatured === 'true') filters.isFeatured = true
  if (sale === 'true') filters.discountPrice = { $exists: true }
  if (brand) filters.brand = { $in: brand.split(',') }
  if (minPrice || maxPrice) filters.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) }
  if (size) filters['variants.size'] = size
  if (color) filters['variants.color'] = color
  if (minRating) filters.ratings = { $gte: +minRating }
  if (search) filters.$text = { $search: search }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
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

// ── Inventory ────────────────────────────────────────────────────────────────

export const getInventory = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id).select('name variants')
  if (!product) throw new AppError('Product not found', 404)

  const LOW_STOCK = 5
  const inventory = product.variants.map((v) => ({
    variantId: v._id,
    size: v.size,
    color: v.color,
    sku: v.sku,
    stock: v.stock,
    status: v.stock === 0 ? 'out_of_stock' : v.stock <= LOW_STOCK ? 'low_stock' : 'in_stock',
  }))

  res.json({
    success: true,
    data: {
      productId: product._id,
      name: product.name,
      totalStock: product.variants.reduce((s, v) => s + v.stock, 0),
      inventory,
    },
  })
}

export const updateInventory = async (req: Request, res: Response) => {
  // Body: { updates: [{ variantId, stock }] }
  const { updates } = req.body as { updates: { variantId: string; stock: number }[] }
  if (!Array.isArray(updates) || updates.length === 0) throw new AppError('updates array required', 400)

  const product = await ProductModel.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  for (const { variantId, stock } of updates) {
    const variant = product.variants.find((v) => v._id!.toString() === variantId)
    if (variant) variant.stock = Math.max(0, stock)
  }
  await product.save()

  res.json({ success: true, data: product.variants })
}

export const getLowStock = async (req: Request, res: Response) => {
  const threshold = Number(req.query.threshold ?? 5)
  const products = await ProductModel.find({
    isActive: true,
    'variants.stock': { $lte: threshold },
  }).select('name variants')

  const alerts = products.map((p) => ({
    productId: p._id,
    name: p.name,
    lowVariants: p.variants
      .filter((v) => v.stock <= threshold)
      .map((v) => ({ variantId: v._id, size: v.size, color: v.color, sku: v.sku, stock: v.stock })),
  }))

  res.json({ success: true, data: alerts })
}

// ── Autocomplete ──────────────────────────────────────────────────────────────

export const autocomplete = async (req: Request, res: Response) => {
  const q = ((req.query.q as string) ?? '').trim()
  if (q.length < 2) return res.json({ success: true, data: [] })

  const products = await ProductModel.find(
    { isActive: true, $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(8)
    .select('name slug images price discountPrice')

  res.json({
    success: true,
    data: products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.images[0] ?? '',
      price: p.discountPrice ?? p.price,
    })),
  })
}

// ── Related products ──────────────────────────────────────────────────────────

export const getRelatedProducts = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id).select('category price')
  if (!product) throw new AppError('Product not found', 404)

  const related = await ProductModel.find({
    isActive: true,
    _id: { $ne: product._id },
    category: product.category,
  })
    .sort({ ratings: -1 })
    .limit(6)
    .select('name slug images price discountPrice ratings reviewCount')

  res.json({ success: true, data: related })
}

// ── Filter facets ─────────────────────────────────────────────────────────────

export const getProductFilters = async (_req: Request, res: Response) => {
  const [brands, categories, sizeColors, priceRange] = await Promise.all([
    ProductModel.distinct('brand', { isActive: true }),
    ProductModel.distinct('category', { isActive: true }),
    ProductModel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$variants' },
      {
        $group: {
          _id: null,
          sizes:  { $addToSet: '$variants.size' },
          colors: { $addToSet: '$variants.color' },
        },
      },
    ]),
    ProductModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' },
        },
      },
    ]),
  ])

  res.json({
    success: true,
    data: {
      brands: brands.sort(),
      categories: categories.sort(),
      sizes:  (sizeColors[0]?.sizes  ?? []).sort(),
      colors: (sizeColors[0]?.colors ?? []).sort(),
      price: {
        min: priceRange[0]?.min ?? 0,
        max: priceRange[0]?.max ?? 0,
      },
    },
  })
}
