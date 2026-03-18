import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { env } from '../config/env'

let io: Server | null = null

/** Access the Socket.io instance from controllers */
export const getIO = (): Server | null => io

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`)

    // Join user's private room for order updates
    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`)
    })

    // Admin joins admin room for new-order / order-update notifications
    socket.on('join:admin', () => {
      socket.join('admin')
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`)
    })
  })

  return io
}
