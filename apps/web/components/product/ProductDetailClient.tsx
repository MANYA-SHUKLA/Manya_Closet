'use client'
import { useState } from 'react'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'
import { IProduct } from '@manya-closet/types'

export default function ProductDetailClient({ product }: { product: IProduct }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const stock =
    selectedSize && selectedColor
      ? product.variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor
        )?.stock ?? 0
      : selectedSize
      ? product.variants.find((v) => v.size === selectedSize)?.stock ?? 0
      : product.variants.reduce((s, v) => s + v.stock, 0)

  return (
    <div className="space-y-6">
      <VariantSelector
        variants={product.variants}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSize={setSelectedSize}
        onColor={setSelectedColor}
      />
      <AddToCartButton
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        stock={stock}
      />
    </div>
  )
}
