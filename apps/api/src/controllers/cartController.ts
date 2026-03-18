import { Request, Response } from 'express'
import { CartModel } from '../models/Cart'
import { ProductModel } from '../models/Product'
import { AppError } from '../middleware/error'

const calcTotal = (items: { price: number; quantity: number }[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const getCart = async (req: Request, res: Response) => {
  const cart = await CartModel.findOne({ user: req.user!._id }).populate('items.product', 'name images price isActive')
  res.json({ success: true, data: cart || { items: [], total: 0 } })
}

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity = 1, size, color } = req.body
  const product = await ProductModel.findById(productId)
  if (!product || !product.isActive) throw new AppError('Product not found', 404)

  // Check variant stock
  const variant = product.variants.find((v) => v.size === size && v.color === color)
  if (!variant) throw new AppError('Selected size/color not available', 400)

  let cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart) cart = await CartModel.create({ user: req.user!._id, items: [], total: 0 })

  const existingIdx = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.size === size && i.color === color
  )

  const newQty = existingIdx >= 0 ? cart.items[existingIdx].quantity + quantity : quantity
  if (newQty > variant.stock) throw new AppError(`Only ${variant.stock} units available`, 400)

  if (existingIdx >= 0) {
    cart.items[existingIdx].quantity = newQty
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.discountPrice || product.price,
      quantity,
      size,
      color,
    })
  }

  cart.total = calcTotal(cart.items)
  await cart.save()
  res.json({ success: true, data: cart })
}

export const updateCartItem = async (req: Request, res: Response) => {
  const { quantity } = req.body
  if (!quantity || quantity < 1) throw new AppError('Quantity must be at least 1', 400)

  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart) throw new AppError('Cart not found', 404)

  const item = cart.items.find((i) => i._id?.toString() === req.params.itemId)
  if (!item) throw new AppError('Item not found', 404)

  // Verify stock for new quantity
  const product = await ProductModel.findById(item.product)
  if (product) {
    const variant = product.variants.find((v) => v.size === item.size && v.color === item.color)
    if (variant && quantity > variant.stock) {
      throw new AppError(`Only ${variant.stock} units available`, 400)
    }
  }

  item.quantity = quantity
  cart.total = calcTotal(cart.items)
  await cart.save()
  res.json({ success: true, data: cart })
}

export const removeFromCart = async (req: Request, res: Response) => {
  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart) throw new AppError('Cart not found', 404)

  cart.items = cart.items.filter((i) => i._id?.toString() !== req.params.itemId) as typeof cart.items
  cart.total = calcTotal(cart.items)
  await cart.save()
  res.json({ success: true, data: cart })
}

export const clearCart = async (req: Request, res: Response) => {
  await CartModel.findOneAndUpdate({ user: req.user!._id }, { items: [], total: 0 })
  res.json({ success: true, message: 'Cart cleared' })
}

/** Merge guest cart items into the authenticated user's DB cart (called after login) */
export const mergeCart = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (req.user as any)._id
  const { items } = req.body as {
    items: { productId: string; quantity: number; size: string; color: string }[]
  }

  if (!items?.length) {
    const cart = await CartModel.findOne({ user: userId })
    return res.json({ success: true, data: cart || { items: [], total: 0 } })
  }

  let cart = await CartModel.findOne({ user: userId })
  if (!cart) cart = await CartModel.create({ user: userId, items: [], total: 0 })

  for (const item of items) {
    const product = await ProductModel.findById(item.productId)
    if (!product || !product.isActive) continue

    const variant = product.variants.find((v) => v.size === item.size && v.color === item.color)
    if (!variant || variant.stock <= 0) continue

    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === item.productId && i.size === item.size && i.color === item.color
    )
    if (existingIdx >= 0) continue // keep existing DB quantity, don't override

    const qty = Math.min(item.quantity, variant.stock)
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.discountPrice || product.price,
      quantity: qty,
      size: item.size,
      color: item.color,
    })
  }

  cart.total = calcTotal(cart.items)
  await cart.save()
  res.json({ success: true, data: cart })
}
