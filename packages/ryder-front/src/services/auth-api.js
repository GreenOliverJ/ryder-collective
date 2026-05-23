import { api } from 'src/services/api-client'

export const authApi = {
  register: body => api.post('/auth/register', body),
  login: body => api.post('/auth/login', body),
  me: () => api.get('/auth/me')
}
