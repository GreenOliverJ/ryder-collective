import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(80),
  handle: z.string().min(3).max(32).regex(/^[a-z0-9-]+$/, 'Handle: lowercase letters, numbers, hyphens only')
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})
