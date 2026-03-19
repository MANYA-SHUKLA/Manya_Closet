'use client'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace('/api', '')

let _socket: Socket | null = null

function getSocket(): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, { withCredentials: true, autoConnect: false })
  }
  return _socket
}

/** Subscribe to live status updates for a specific order */
export const useOrderTracking = (orderId?: string) => {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  const joined = useRef(false)

  useEffect(() => {
    if (!user || !orderId) return
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    if (!joined.current) {
      socket.emit('join:user', user._id)
      joined.current = true
    }

    const handleUpdate = (data: { orderId: string; status: string; paymentStatus: string }) => {
      if (data.orderId === orderId) {
        qc.invalidateQueries({ queryKey: ['order', orderId] })
        qc.invalidateQueries({ queryKey: ['orders'] })
      }
    }

    socket.on('order:update', handleUpdate)
    return () => { socket.off('order:update', handleUpdate) }
  }, [user, orderId, qc])
}

export const useAdminSocket = () => {
  const qc = useQueryClient()
  const joined = useRef(false)

  useEffect(() => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()

    if (!joined.current) {
      socket.emit('join:admin')
      joined.current = true
    }

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    }

    socket.on('admin:new-order', invalidate)
    socket.on('admin:order-update', invalidate)
    return () => {
      socket.off('admin:new-order', invalidate)
      socket.off('admin:order-update', invalidate)
    }
  }, [qc])
}
