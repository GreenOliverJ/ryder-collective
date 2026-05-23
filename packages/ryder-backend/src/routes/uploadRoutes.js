import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { randomBytes } from 'crypto'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadService } from '../services/uploadService.js'
import { env } from '../config/env.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), env.uploadDir))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp3'
    cb(null, `${randomBytes(8).toString('hex')}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp3|wav|ogg|m4a|aac|flac)$/i
    if (allowed.test(file.originalname) || file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'))
    }
  }
})

const router = Router()

router.post(
  '/:riderId/tracks/:trackId',
  requireAuth,
  upload.single('audio'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }
    const rider = await uploadService.attachAudioToRider(
      req.userId,
      req.params.riderId,
      req.params.trackId,
      req.file
    )
    res.json({ rider })
  })
)

export default router
