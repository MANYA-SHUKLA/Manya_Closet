export interface IProductVariant {
  _id?: string
  size: string
  color: string
  stock: number
  sku: string
}


export interface IProduct {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  brand: string
  variants: IProductVariant[]
  ratings: number
  reviewCount: number
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  color?: string
  search?: string
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}
