import { env } from './env.js'

const LAN_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/

const configuredOrigins = env.corsOrigin
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

function isAllowedOrigin (origin) {
  if (!origin) return true
  if (configuredOrigins.includes(origin)) return true
  if (LAN_ORIGIN.test(origin)) return true
  return false
}

export function corsOptions () {
  return {
    credentials: true,
    origin (origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, origin || true)
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`))
      }
    }
  }
}
