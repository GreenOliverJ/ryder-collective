import { User } from '../models/User.js'

export const userRepository = {
  async create (data) {
    const user = new User(data)
    return user.save()
  },

  async findByEmail (email) {
    return User.findOne({ email: email.toLowerCase() }).lean()
  },

  async findByHandle (handle) {
    return User.findOne({ handle: handle.toLowerCase() }).lean()
  },

  async findById (id) {
    return User.findById(id).select('-passwordHash').lean()
  },

  async findByEmailWithPassword (email) {
    return User.findOne({ email: email.toLowerCase() })
  },

  async setPasswordResetToken ({ userId, tokenHash, expiresAt }) {
    await User.updateOne(
      { _id: userId },
      { $set: { passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt } }
    )
  },

  async clearPasswordResetToken (userId) {
    await User.updateOne(
      { _id: userId },
      { $set: { passwordResetTokenHash: null, passwordResetExpiresAt: null } }
    )
  },

  async findByValidPasswordResetTokenHash (tokenHash) {
    return User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() }
    })
  },

  async isHandleTaken (handle, excludeId) {
    const query = { handle: handle.toLowerCase() }
    if (excludeId) query._id = { $ne: excludeId }
    return Boolean(await User.exists(query))
  }
}
