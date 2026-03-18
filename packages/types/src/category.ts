export interface ICategory {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: { _id: string; name: string; slug: string } | null
  sortOrder: number
  isActive: boolean
  productCount?: number
  createdAt: string
  updatedAt: string
}

export interface IProductFilterFacets {
  brands: string[]
  categories: string[]
  sizes: string[]
  colors: string[]
  price: { min: number; max: number }
}
