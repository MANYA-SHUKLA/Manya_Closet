'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

interface Review {
  _id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string; avatar?: string }
}

function Stars({ count, size = 'sm' }: { count: number; size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <span className={`flex gap-0.5 ${s}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'text-amber-400' : 'text-neutral-200'}>★</span>
      ))}
    </span>
  )
}

function RatingInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl transition-colors ${
            i < (hover || value) ? 'text-amber-400' : 'text-neutral-200'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId, ratings, reviewCount }: {
  productId: string
  ratings: number
  reviewCount: number
}) {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  const [form, setForm] = useState({ rating: 0, comment: '' })
  const [showForm, setShowForm] = useState(false)

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Review[] }>(`/products/${productId}/reviews`)
      return data.data
    },
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => api.post(`/products/${productId}/reviews`, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', productId] })
      setForm({ rating: 0, comment: '' })
      setShowForm(false)
    },
  })

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviewCount ? Math.round((reviews.filter((r) => r.rating === star).length / reviewCount) * 100) : 0,
  }))

  return (
    <div className="mt-16 border-t border-neutral-100 pt-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">Reviews & Ratings</h2>

      {/* Summary */}
      {reviewCount > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-neutral-50 rounded-2xl">
          <div className="text-center">
            <p className="text-6xl font-black text-neutral-900">{ratings.toFixed(1)}</p>
            <Stars count={Math.round(ratings)} size="lg" />
            <p className="text-sm text-neutral-500 mt-1">{reviewCount} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-3">{star}</span>
                <span className="text-amber-400 text-xs">★</span>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review */}
      {user && (
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-sm font-medium text-neutral-500 hover:border-amber-300 hover:text-amber-600 transition-all w-full"
            >
              + Write a Review
            </button>
          ) : (
            <div className="p-6 border border-neutral-200 rounded-2xl space-y-4">
              <h3 className="font-semibold text-neutral-900">Your Review</h3>
              <RatingInput value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
              <textarea
                rows={4}
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {error && (
                <p className="text-sm text-rose-500">
                  {(error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to submit'}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => mutate()}
                  disabled={isPending || form.rating === 0 || !form.comment}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Submitting…' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="flex gap-4 pb-6 border-b border-neutral-50 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {review.user.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-neutral-900">{review.user.name}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Stars count={review.rating} />
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
