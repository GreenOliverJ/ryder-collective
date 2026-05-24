import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { riderService } from '../services/riderService.js'
import { demoService } from '../services/demoService.js'

const router = Router()

router.get('/demo', (req, res) => {
  res.json({ showcase: demoService.getShowcaseMeta() })
})

router.get('/stage/:handle/:slug', asyncHandler(async (req, res) => {
  const data = await riderService.getPublicByHandleAndSlug(req.params.handle, req.params.slug)
  res.json(data)
}))

router.get('/s/:publicId', asyncHandler(async (req, res) => {
  const data = await riderService.getPublicByPublicId(req.params.publicId)
  res.json(data)
}))

export default router
