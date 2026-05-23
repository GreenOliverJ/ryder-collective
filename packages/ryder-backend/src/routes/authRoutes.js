import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authService } from '../services/authService.js'
import { requireAuth } from '../middleware/auth.js'
import { registerSchema, loginSchema } from '../validators/authSchemas.js'

const router = Router()

router.post('/register', asyncHandler(async (req, res) => {
  const body = registerSchema.parse(req.body)
  const result = await authService.register(body)
  res.status(201).json(result)
}))

router.post('/login', asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body)
  const result = await authService.login(body)
  res.json(result)
}))

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await authService.me(req.user._id)
  res.json({ user })
}))

export default router
