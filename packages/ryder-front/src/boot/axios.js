import { boot } from 'quasar/wrappers'
import { api } from 'src/services/api-client'
import { useAuthStore } from 'src/stores/auth-store'

const AUTH_PATHS = ['/auth/login', '/auth/register']

function isAuthRequest (url = '') {
  return AUTH_PATHS.some(path => url.includes(path))
}

api.interceptors.request.use(config => {
  try {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
  } catch {
    // Pinia not ready yet — token read from storage as fallback
    const token = localStorage.getItem('ryder_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !isAuthRequest(err.config?.url)) {
      try {
        useAuthStore().logout()
      } catch {
        localStorage.removeItem('ryder_token')
      }
    }
    return Promise.reject(err)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
