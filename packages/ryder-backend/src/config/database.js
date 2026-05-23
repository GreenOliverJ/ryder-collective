import mongoose from 'mongoose'
import { env } from './env.js'

const MAX_ATTEMPTS = 30
const DELAY_MS = 2000

export async function connectDatabase () {
  mongoose.set('strictQuery', true)

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await mongoose.connect(env.mongoUri)
      console.log('[db] connected to MongoDB')
      return
    } catch (err) {
      console.error(`[db] connect attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err.message)
      if (attempt === MAX_ATTEMPTS) throw err
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }
}
