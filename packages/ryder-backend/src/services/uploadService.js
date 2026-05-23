import path from 'path'
import fs from 'fs/promises'
import { env } from '../config/env.js'
import { riderRepository } from '../repositories/riderRepository.js'

export const uploadService = {
  async attachAudioToRider (ownerId, riderId, trackId, file) {
    const rider = await riderRepository.findByOwnerAndId(ownerId, riderId)
    if (!rider) {
      const err = new Error('Rider not found')
      err.status = 404
      throw err
    }

    const track = rider.audioTracks?.find(t => t.id === trackId)
    if (!track) {
      const err = new Error('Audio track not found on rider')
      err.status = 404
      throw err
    }

    const url = `/uploads/${file.filename}`
    const audioTracks = rider.audioTracks.map(t =>
      t.id === trackId ? { ...t, url, filename: file.originalname } : t
    )

    return riderRepository.updateByOwner(ownerId, riderId, { audioTracks })
  },

  getUploadPath () {
    return path.resolve(process.cwd(), env.uploadDir)
  },

  async ensureUploadDir () {
    await fs.mkdir(this.getUploadPath(), { recursive: true })
  }
}
