import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { Rider } from '../models/Rider.js'
import {
  DEMO_EMAIL,
  DEMO_HANDLE,
  DEMO_PASSWORD,
  DEMO_SLUG,
  getDemoRiderFields,
  getDemoShowcaseMeta
} from '../data/demoRider.js'
import { copyDemoAssetsToUploads } from '../data/demoAssets.js'
import { riderRepository } from '../repositories/riderRepository.js'
import { uploadService } from './uploadService.js'
import { toSlug, uniquePublicId } from '../utils/slug.js'

export const demoService = {
  getShowcaseMeta () {
    return getDemoShowcaseMeta()
  },

  async ensureDemoSeed () {
    await copyDemoAssetsToUploads(uploadService.getUploadPath())

    let user = await User.findOne({ email: DEMO_EMAIL })
    if (!user) {
      user = await User.create({
        email: DEMO_EMAIL,
        passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
        displayName: 'Demo Band',
        handle: DEMO_HANDLE
      })
      console.log('[demo] created demo user')
    }

    const fields = getDemoRiderFields()
    const existing = await Rider.findOne({ ownerId: user._id, slug: DEMO_SLUG })

    if (!existing) {
      await Rider.create({
        ownerId: user._id,
        ...fields,
        publicId: uniquePublicId()
      })
      console.log('[demo] created showcase rider')
    } else {
      await Rider.findOneAndUpdate(
        { _id: existing._id },
        { $set: fields },
        { runValidators: true }
      )
      if (!existing.publicId) {
        await Rider.findByIdAndUpdate(existing._id, { publicId: uniquePublicId() })
      }
    }

    console.log(`[demo] showcase ready at /stage/${DEMO_HANDLE}/${DEMO_SLUG}`)
  },

  async cloneForUser (ownerId) {
    await this.ensureDemoSeed()
    const baseTitle = 'Demo Night (copy)'
    const slug = await uniqueSlugForOwner(ownerId, baseTitle)

    return riderRepository.create({
      ownerId,
      ...getDemoRiderFields(),
      title: baseTitle,
      slug,
      isPublished: false,
      publicId: uniquePublicId()
    })
  }
}

async function uniqueSlugForOwner (ownerId, title) {
  let slug = toSlug(title)
  let n = 1
  while (await riderRepository.slugExistsForOwner(ownerId, slug)) {
    slug = `${toSlug(title)}-${++n}`
  }
  return slug
}
