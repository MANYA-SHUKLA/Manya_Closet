import 'dotenv/config'
import http from 'http'
import app from './app'
import { connectDB } from './config/db'
import { initSocket } from './sockets'
import { env } from './config/env'

const server = http.createServer(app)
initSocket(server)

const start = async () => {
  await connectDB()
  server.listen(env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}`)
    console.log(`🔌 Socket.io ready`)
  })
}

start()
