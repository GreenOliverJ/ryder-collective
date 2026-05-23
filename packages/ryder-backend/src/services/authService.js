import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { userRepository } from '../repositories/userRepository.js'
import { toSlug } from '../utils/slug.js'

function signToken (userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
}

export const authService = {
  async register ({ email, password, displayName, handle }) {
    const normalizedHandle = handle.toLowerCase()

    if (await userRepository.findByEmail(email)) {
      const err = new Error('Email already registered')
      err.status = 409
      throw err
    }

    if (await userRepository.isHandleTaken(normalizedHandle)) {
      const err = new Error('Handle already taken')
      err.status = 409
      throw err
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await userRepository.create({
      email,
      passwordHash,
      displayName,
      handle: normalizedHandle
    })

    const token = signToken(user._id.toString())
    const safeUser = await userRepository.findById(user._id)

    return { user: safeUser, token }
  },

  async login ({ email, password }) {
    const user = await userRepository.findByEmailWithPassword(email)
    if (!user) {
      const err = new Error('Invalid email or password')
      err.status = 401
      throw err
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      const err = new Error('Invalid email or password')
      err.status = 401
      throw err
    }

    const token = signToken(user._id.toString())
    const safeUser = await userRepository.findById(user._id)

    return { user: safeUser, token }
  },

  async me (userId) {
    const user = await userRepository.findById(userId)
    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }
    return user
  },

  suggestHandle (displayName) {
    return toSlug(displayName).slice(0, 32)
  }
}
