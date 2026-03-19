'use client'
import { useState } from 'react'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'
import { useAddToCart } from '@/hooks/useCart'
import { IProduct } from '@manya-closet/types'

export default function ProductDetailClient({ product }: { product: IProduct }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Modal-local selections (start from whatever is already chosen)
  const [modalSize, setModalSize] = useState('')
  const [modalColor, setModalColor] = useState('')

  const { mutate: addToCart, isPending: modalPending } = useAddToCart()

  const stock =
    selectedSize && selectedColor
      ? product.variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor
        )?.stock ?? 0
      : selectedSize
      ? product.variants.find((v) => v.size === selectedSize)?.stock ?? 0
      : product.variants.reduce((s, v) => s + v.stock, 0)

  const openModal = () => {
    setModalSize(selectedSize)
    setModalColor(selectedColor)
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)

  const handleModalAdd = () => {
    if (!modalSize || !modalColor) return
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.images[0] ?? '',
      price: product.discountPrice ?? product.price,
      quantity: 1,
      size: modalSize,
      color: modalColor,
    })
    // Sync back to page selections and close
    setSelectedSize(modalSize)
    setSelectedColor(modalColor)
    setShowModal(false)
  }

  const modalStock = modalSize && modalColor
    ? product.variants.find((v) => v.size === modalSize && v.color === modalColor)?.stock ?? 0
    : 0

  const missing = !selectedSize && !selectedColor
    ? 'size and colour'
    : !selectedSize
    ? 'size'
    : 'colour'

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
        onMissingVariant={openModal}
      />

      {/* Variant picker modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Choose your {missing}</h2>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.name}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Variant selector */}
            <div className="px-6 py-5">
              <VariantSelector
                variants={product.variants}
                selectedSize={modalSize}
                selectedColor={modalColor}
                onSize={setModalSize}
                onColor={setModalColor}
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={handleModalAdd}
                disabled={!modalSize || !modalColor || modalStock === 0 || modalPending}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all active:scale-95"
              >
                {modalPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding…
                  </span>
                ) : !modalSize || !modalColor
                  ? `Select ${missing} to continue`
                  : modalStock === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
