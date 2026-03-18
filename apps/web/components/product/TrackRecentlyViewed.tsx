'use client'
import { useEffect } from 'react'
import { useRecentlyViewedStore, RecentProduct } from '@/store/recentlyViewedStore'

export default function TrackRecentlyViewed({ product }: { product: RecentProduct }) {
  const add = useRecentlyViewedStore((s) => s.add)
  useEffect(() => { add(product) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
