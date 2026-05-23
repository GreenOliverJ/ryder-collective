import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import authRoutes from './routes/authRoutes.js'
import riderRoutes from './routes/riderRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { uploadService } from './services/uploadService.js'

export async function createApp () {
  await uploadService.ensureUploadDir()

  const app = express()

  app.use(morgan('dev'))
  app.use(cors(corsOptions()))
  app.use(express.json({ limit: '2mb' }))
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.uploadDir)))

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'ryder-backend' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/riders', riderRoutes)
  app.use('/api/public', publicRoutes)
  app.use('/api/uploads', uploadRoutes)

  app.use(errorHandler)

  return app
}
