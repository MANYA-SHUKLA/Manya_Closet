import { Request, Response } from 'express'
import { WishlistModel } from '../models/Wishlist'

export const getWishlist = async (req: Request, res: Response) => {
  const wishlist = await WishlistModel.findOne({ user: req.user!._id }).populate(
    'products',
    'name slug images price discountPrice brand ratings'
  )
  res.json({ success: true, data: wishlist?.products ?? [] })
}

export const syncWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any)._id
  const { productIds } = req.body as { productIds: string[] }

  if (!productIds?.length) return res.json({ success: true })

  let wishlist = await WishlistModel.findOne({ user: userId })
  if (!wishlist) wishlist = await WishlistModel.create({ user: userId, products: [] })

  for (const pid of productIds) {
    if (!wishlist.products.some((p) => p.toString() === pid)) {
      wishlist.products.push(pid as any)
    }
  }

  await wishlist.save()
  res.json({ success: true })
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
