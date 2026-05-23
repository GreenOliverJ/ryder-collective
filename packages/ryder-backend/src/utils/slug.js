import slugify from 'slugify'
import { randomBytes } from 'crypto'

export function toSlug (value) {
  return slugify(value || 'rider', { lower: true, strict: true }) || 'rider'
}

export function uniquePublicId () {
  return randomBytes(6).toString('hex')
}
