import { api } from 'src/services/api-client'

export const authApi = {
  register: body => api.post('/auth/register', body),
  login: body => api.post('/auth/login', body),
  me: () => api.get('/auth/me'),
  forgotPassword: body => api.post('/auth/forgot-password', body),
  resetPassword: body => api.post('/auth/reset-password', body)
}
