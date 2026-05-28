import sendgrid from '@sendgrid/mail'
import { env } from '../config/env.js'

function ensureConfigured () {
  if (!env.sendgridApiKey || !env.sendgridFromEmail) {
    const err = new Error('SendGrid not configured (missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL)')
    err.status = 500
    throw err
  }
  sendgrid.setApiKey(env.sendgridApiKey)
}

export const emailService = {
  async sendPasswordResetEmail ({ to, resetUrl }) {
    if (env.isDev && (!env.sendgridApiKey || !env.sendgridFromEmail)) {
      console.log('[password-reset] SendGrid not configured; reset link:', resetUrl)
      return
    }

    ensureConfigured()

    await sendgrid.send({
      to,
      from: env.sendgridFromEmail,
      subject: 'Reset your password',
      text: `Reset your password using this link: ${resetUrl}`,
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `
    })
  }
}

