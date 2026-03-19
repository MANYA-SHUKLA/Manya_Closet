import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { env } from '../config/env'

let io: Server | null = null

export const getIO = (): Server | null => io

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`)

    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`)
    })

    socket.on('join:admin', () => {
      socket.join('admin')
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`)
    })
  })

  return io
}
