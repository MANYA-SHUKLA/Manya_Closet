export interface ICartItem {
  product: string
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface ICart {
  _id: string
  user: string
  items: ICartItem[]
  total: number
  updatedAt: string
}
