import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env.js'
import { userRepository } from '../repositories/userRepository.js'
import { toSlug } from '../utils/slug.js'
import { emailService } from './emailService.js'

function signToken (userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
}

function sha256 (value) {
  return crypto.createHash('sha256').update(value).digest('hex')
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

  async requestPasswordReset ({ email }) {
    const normalizedEmail = email.toLowerCase()
    const user = await userRepository.findByEmail(normalizedEmail)

    // Always respond "ok" (avoid user enumeration).
    if (!user) {
      if (env.isDev) console.log('[password-reset] requested for non-existent email:', normalizedEmail)
      return { ok: true }
    }

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = sha256(token)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes

    await userRepository.setPasswordResetToken({ userId: user._id, tokenHash, expiresAt })

    const resetUrl = `${env.appWebUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`
    if (env.isDev) console.log('[password-reset] issuing reset link for', normalizedEmail, '->', resetUrl)
    await emailService.sendPasswordResetEmail({ to: normalizedEmail, resetUrl })

    return { ok: true }
  },

  async resetPassword ({ token, password }) {
    const tokenHash = sha256(token)
    const user = await userRepository.findByValidPasswordResetTokenHash(tokenHash)

    if (!user) {
      const err = new Error('Invalid or expired reset token')
      err.status = 400
      throw err
    }

    user.passwordHash = await bcrypt.hash(password, 12)
    user.passwordResetTokenHash = null
    user.passwordResetExpiresAt = null
    await user.save()

    return { ok: true }
  },

  suggestHandle (displayName) {
    return toSlug(displayName).slice(0, 32)
  }
}
