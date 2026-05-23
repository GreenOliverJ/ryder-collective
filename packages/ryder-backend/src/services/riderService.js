import { riderRepository } from '../repositories/riderRepository.js'
import { userRepository } from '../repositories/userRepository.js'
import { toSlug, uniquePublicId } from '../utils/slug.js'

export const riderService = {
  async listForUser (ownerId) {
    return riderRepository.findAllByOwner(ownerId)
  },

  async getForUser (ownerId, id) {
    const rider = await riderRepository.findByOwnerAndId(ownerId, id)
    if (!rider) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }
    return rider
  },

  async create (ownerId, payload) {
    const slug = toSlug(payload.slug || payload.title)
    if (await riderRepository.slugExistsForOwner(ownerId, slug)) {
      const err = new Error('You already have a rider with this slug')
      err.status = 409
      throw err
    }

    return riderRepository.create({
      ownerId,
      title: payload.title,
      slug,
      bandName: payload.bandName || '',
      description: payload.description || '',
      publicId: uniquePublicId(),
      musicians: [],
      audioTracks: []
    })
  },

  async update (ownerId, id, payload) {
    const existing = await riderRepository.findByOwnerAndId(ownerId, id)
    if (!existing) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }

    const update = { ...payload }

    if (payload.slug) {
      const slug = toSlug(payload.slug)
      if (slug !== existing.slug && await riderRepository.slugExistsForOwner(ownerId, slug, id)) {
        const err = new Error('You already have a rider with this slug')
        err.status = 409
        throw err
      }
      update.slug = slug
    }

    if (payload.isPublished === true && !existing.publicId) {
      update.publicId = uniquePublicId()
    }

    const updated = await riderRepository.updateByOwner(ownerId, id, update)
    return updated
  },

  async remove (ownerId, id) {
    const result = await riderRepository.deleteByOwner(ownerId, id)
    if (result.deletedCount === 0) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }
  },

  async getPublicByHandleAndSlug (handle, slug) {
    const user = await userRepository.findByHandle(handle)
    if (!user) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }

    const rider = await riderRepository.findByOwnerAndSlug(user._id, slug)
    if (!rider || !rider.isPublished) {
      const err = new Error('Rider not found or not published')
      err.status = 404
      throw err
    }

    return {
      rider,
      owner: { displayName: user.displayName, handle: user.handle }
    }
  },

  async getPublicByPublicId (publicId) {
    const rider = await riderRepository.findPublishedByPublicId(publicId)
    if (!rider || !rider.ownerId) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }

    return {
      rider,
      owner: {
        displayName: rider.ownerId.displayName,
        handle: rider.ownerId.handle
      }
    }
  },

  getPublicUrls (ownerHandle, rider) {
    return {
      byHandle: `/stage/${ownerHandle}/${rider.slug}`,
      byPublicId: rider.publicId ? `/s/${rider.publicId}` : null
    }
  }
}
