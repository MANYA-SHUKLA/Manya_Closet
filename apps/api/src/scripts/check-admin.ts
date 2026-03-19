import 'dotenv/config'
import mongoose from 'mongoose'
import { UserModel } from '../models/User'

const URI = process.env.MONGODB_URI || ''

async function main() {
  await mongoose.connect(URI)
  const user = await UserModel.findOne({ email: 'shuklamanya99@gmail.com' }).select('+password')
  if (user) {
    console.log('Found user:')
    console.log('  role:', user.role)
    console.log('  isVerified:', user.isVerified)
    console.log('  hasPassword:', !!user.password)
  } else {
    console.log('No user found with that email')
  }
  await mongoose.disconnect()
}

main().catch(console.error)
