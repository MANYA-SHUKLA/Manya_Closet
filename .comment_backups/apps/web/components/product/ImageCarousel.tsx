'use client'
import { useState } from 'react'
import { FALLBACK_IMAGES } from '@/lib/imageUtils'

export default function ImageCarousel({ images }: { images: string[] }) {
  const imgs = images.length > 0 ? images : FALLBACK_IMAGES.slice(0, 4)
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i === 0 ? imgs.length - 1 : i - 1))
  const next = () => setActive((i) => (i === imgs.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-4">
      {}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-100 group">
        <img
          src={imgs[active]}
          alt="Product"
          className="w-full h-full object-cover transition-all duration-500"
        />

        {}
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {}
        {imgs.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all ${
                  i === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {}
      {imgs.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
