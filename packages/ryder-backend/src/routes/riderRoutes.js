import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { riderService } from '../services/riderService.js'
import { demoService } from '../services/demoService.js'
import { createRiderSchema, updateRiderSchema } from '../validators/riderSchemas.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const riders = await riderService.listForUser(req.userId)
  res.json({ riders, showcase: demoService.getShowcaseMeta() })
}))

router.post('/from-demo', asyncHandler(async (req, res) => {
  const rider = await demoService.cloneForUser(req.userId)
  res.status(201).json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = createRiderSchema.parse(req.body)
  const rider = await riderService.create(req.userId, body)
  res.status(201).json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const rider = await riderService.getForUser(req.userId, req.params.id)
  res.json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const body = updateRiderSchema.parse(req.body)
  const rider = await riderService.update(req.userId, req.params.id, body)
  res.json({
    rider,
    urls: riderService.getPublicUrls(req.user.handle, rider)
  })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  await riderService.remove(req.userId, req.params.id)
  res.status(204).send()
}))

export default router
