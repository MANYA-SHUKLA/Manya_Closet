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

  let cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart) cart = await CartModel.create({ user: req.user!._id, items: [], total: 0 })

  const existingIdx = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.size === size && i.color === color
  )

  if (existingIdx >= 0) {
    cart.items[existingIdx].quantity += quantity
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
  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart) throw new AppError('Cart not found', 404)

  const item = cart.items.id(req.params.itemId)
  if (!item) throw new AppError('Item not found', 404)

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
