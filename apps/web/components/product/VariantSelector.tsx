'use client'

interface Variant { size: string; color: string; stock: number }

interface Props {
  variants: Variant[]
  selectedSize: string
  selectedColor: string
  onSize: (s: string) => void
  onColor: (c: string) => void
}

export default function VariantSelector({ variants, selectedSize, selectedColor, onSize, onColor }: Props) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]

  const stockFor = (size: string, color: string) =>
    variants.find((v) => v.size === size && v.color === color)?.stock ?? 0

  const selectedStock = selectedSize && selectedColor
    ? stockFor(selectedSize, selectedColor)
    : null

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-neutral-700">
              Size {selectedSize && <span className="text-amber-600 ml-1">— {selectedSize}</span>}
            </p>
            <button className="text-xs text-amber-600 hover:underline">Size guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const inStock = colors.length > 0
                ? colors.some((c) => stockFor(size, c) > 0)
                : variants.find((v) => v.size === size)?.stock! > 0
              return (
                <button
                  key={size}
                  onClick={() => onSize(size)}
                  disabled={!inStock}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    selectedSize === size
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : inStock
                      ? 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      : 'border-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-neutral-700 mb-2">
            Color {selectedColor && <span className="text-amber-600 ml-1">— {selectedColor}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColor(color)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                  selectedColor === color
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedStock !== null && (
        <div className={`flex items-center gap-2 text-sm font-medium ${
          selectedStock > 10 ? 'text-emerald-600' :
          selectedStock > 0 ? 'text-amber-600' : 'text-rose-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            selectedStock > 10 ? 'bg-emerald-500' :
            selectedStock > 0 ? 'bg-amber-500' : 'bg-rose-500'
          }`} />
          {selectedStock > 10 ? 'In Stock' :
           selectedStock > 0 ? `Only ${selectedStock} left` : 'Out of Stock'}
        </div>
      )}
    </div>
  )
}
