import { Request, Response } from 'express'
import { WishlistModel } from '../models/Wishlist'

export const getWishlist = async (req: Request, res: Response) => {
  const wishlist = await WishlistModel.findOne({ user: req.user!._id }).populate(
    'products',
    'name slug images price discountPrice brand ratings'
  )
  res.json({ success: true, data: wishlist?.products ?? [] })
}

export const toggleWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body
  let wishlist = await WishlistModel.findOne({ user: req.user!._id })
  if (!wishlist) wishlist = await WishlistModel.create({ user: req.user!._id, products: [] })

  const exists = wishlist.products.some((p) => p.toString() === productId)
  if (exists) {
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId) as typeof wishlist.products
  } else {
    wishlist.products.push(productId)
  }

  await wishlist.save()
  res.json({ success: true, data: { wishlisted: !exists } })
}
