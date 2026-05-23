import { Rider } from '../models/Rider.js'

export const riderRepository = {
  async create (data) {
    const rider = new Rider(data)
    return rider.save()
  },

  async findById (id) {
    return Rider.findById(id).lean()
  },

  async findByOwnerAndId (ownerId, id) {
    return Rider.findOne({ _id: id, ownerId }).lean()
  },

  async findAllByOwner (ownerId) {
    return Rider.find({ ownerId })
      .sort({ updatedAt: -1 })
      .select('title slug bandName isPublished publicId updatedAt createdAt')
      .lean()
  },

  async findByOwnerAndSlug (ownerId, slug) {
    return Rider.findOne({ ownerId, slug: slug.toLowerCase() }).lean()
  },

  async findPublishedByHandleAndSlug (handle, slug) {
    return Rider.findOne({
      slug: slug.toLowerCase(),
      isPublished: true
    })
      .populate({ path: 'ownerId', match: { handle: handle.toLowerCase() }, select: 'displayName handle' })
      .lean()
  },

  async findPublishedByPublicId (publicId) {
    return Rider.findOne({ publicId, isPublished: true })
      .populate('ownerId', 'displayName handle')
      .lean()
  },

  async updateByOwner (ownerId, id, data) {
    return Rider.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: data },
      { new: true, runValidators: true }
    ).lean()
  },

  async deleteByOwner (ownerId, id) {
    return Rider.deleteOne({ _id: id, ownerId })
  },

  async slugExistsForOwner (ownerId, slug, excludeId) {
    const query = { ownerId, slug: slug.toLowerCase() }
    if (excludeId) query._id = { $ne: excludeId }
    return Boolean(await Rider.exists(query))
  }
}
