import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { riderService } from '../services/riderService.js'
import { createRiderSchema, updateRiderSchema } from '../validators/riderSchemas.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const riders = await riderService.listForUser(req.user._id)
  res.json({ riders })
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = createRiderSchema.parse(req.body)
  const rider = await riderService.create(req.user._id, body)
  res.status(201).json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const rider = await riderService.getForUser(req.user._id, req.params.id)
  res.json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const body = updateRiderSchema.parse(req.body)
  const rider = await riderService.update(req.user._id, req.params.id, body)
  res.json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  await riderService.remove(req.user._id, req.params.id)
  res.status(204).send()
}))

export default router
