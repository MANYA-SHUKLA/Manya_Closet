'use client'
import { useState, useEffect } from 'react'
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useAdmin'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { IProduct } from '@manya-closet/types'
import { FALLBACK_IMAGES } from '@/lib/imageUtils'

interface Variant { size: string; color: string; stock: number; sku: string }
interface ProductForm {
  name: string; description: string; price: string; discountPrice: string
  category: string; brand: string; images: string[]
  isFeatured: boolean; isActive: boolean; variants: Variant[]
}

const EMPTY_FORM: ProductForm = {
  name: '', description: '', price: '', discountPrice: '',
  category: '', brand: '', images: [''],
  isFeatured: false, isActive: true,
  variants: [{ size: 'S', color: 'black', stock: 10, sku: '' }],
}

function toForm(p: IProduct): ProductForm {
  return {
    name: p.name, description: p.description, price: String(p.price),
    discountPrice: p.discountPrice ? String(p.discountPrice) : '',
    category: p.category, brand: p.brand,
    images: p.images.length > 0 ? p.images : [''],
    isFeatured: p.isFeatured, isActive: p.isActive,
    variants: p.variants.map((v) => ({ size: v.size, color: v.color, stock: v.stock, sku: v.sku })),
  }
}

function ProductDrawer({
  product, onClose, onSaved,
}: {
  product: IProduct | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<ProductForm>(product ? toForm(product) : EMPTY_FORM)
  const [error, setError] = useState('')
  const { mutate: create, isPending: creating } = useCreateProduct()
  const { mutate: update, isPending: updating } = useUpdateProduct()
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data.data as { slug: string; name: string }[] },
    staleTime: 300_000,
  })

  useEffect(() => {
    setForm(product ? toForm(product) : EMPTY_FORM)
    setError('')
  }, [product])

  const isPending = creating || updating

  const set = (k: keyof ProductForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.price || !form.category) {
      setError('Name, price, and category are required.')
      return
    }
    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      ...(form.discountPrice ? { discountPrice: Number(form.discountPrice) } : {}),
      category: form.category,
      brand: form.brand.trim(),
      images: form.images.filter((url) => url.trim()),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      variants: form.variants.filter((v) => v.size && v.color),
    }
    if (product) {
      update({ id: product._id, data: body }, { onSuccess: () => { onSaved(); onClose() }, onError: (err: unknown) => setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to update product') })
    } else {
      create(body, { onSuccess: () => { onSaved(); onClose() }, onError: (err: unknown) => setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to create product') })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[520px] bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

          {/* Basic info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                placeholder="e.g. Floral Wrap Dress" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none"
                placeholder="Product description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} min={0}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount Price (₹)</label>
                <input type="number" value={form.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} min={0}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category *</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="">Select...</option>
                  {catData?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</label>
                <input value={form.brand} onChange={(e) => set('brand', e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  placeholder="Brand name" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Image URLs</label>
              <button type="button" onClick={() => set('images', [...form.images, ''])}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add Image</button>
            </div>
            <div className="space-y-2">
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input value={url} onChange={(e) => {
                    const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs)
                  }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="https://..." />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                      className="text-gray-400 hover:text-red-500 transition-colors px-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Variants</label>
              <button type="button"
                onClick={() => set('variants', [...form.variants, { size: '', color: '', stock: 0, sku: '' }])}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add Variant</button>
            </div>
            <div className="space-y-2">
              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-center">
                  <input value={v.size} onChange={(e) => {
                    const vv = [...form.variants]; vv[i] = { ...vv[i], size: e.target.value }; set('variants', vv)
                  }} placeholder="Size (S/M/L)" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                  <input value={v.color} onChange={(e) => {
                    const vv = [...form.variants]; vv[i] = { ...vv[i], color: e.target.value }; set('variants', vv)
                  }} placeholder="Color" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                  <input type="number" value={v.stock} min={0} onChange={(e) => {
                    const vv = [...form.variants]; vv[i] = { ...vv[i], stock: Number(e.target.value) }; set('variants', vv)
                  }} placeholder="Stock" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                  {form.variants.length > 1 && (
                    <button type="button" onClick={() => set('variants', form.variants.filter((_, j) => j !== i))}
                      className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600" />
              Featured
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
              {isPending ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState<{ open: boolean; product: IProduct | null }>({ open: false, product: null })

  const { data, refetch } = useAdminProducts({ search, page, status: status || undefined })
  const { mutate: deleteProduct } = useDeleteProduct()

  const products = data?.data ?? []
  const pagination = data?.pagination

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleDelete = (p: IProduct) => {
    if (!confirm(`Deactivate "${p.name}"?`)) return
    deleteProduct(p._id, { onSuccess: () => refetch() })
  }

  return (
    <div className="p-8">
      {drawer.open && (
        <ProductDrawer
          product={drawer.product}
          onClose={() => setDrawer({ open: false, product: null })}
          onSaved={() => refetch()}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total</p>}
        </div>
        <button
          onClick={() => setDrawer({ open: true, product: null })}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
          <button type="submit" className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors">
            Search
          </button>
        </form>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
              return (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={p.images[0] || FALLBACK_IMAGES[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">{p.category}</td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-gray-900">₹{p.price.toLocaleString()}</p>
                    {p.discountPrice && (
                      <p className="text-xs text-green-600">₹{p.discountPrice.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-semibold ${totalStock === 0 ? 'text-red-500' : totalStock <= 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDrawer({ open: true, product: p })}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No products found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Page {page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
