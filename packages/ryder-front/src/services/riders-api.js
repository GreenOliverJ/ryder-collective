import { api } from 'src/services/api-client'

export const ridersApi = {
  list: () => api.get('/riders'),
  get: id => api.get(`/riders/${id}`),
  createFromDemo: () => api.post('/riders/from-demo'),
  create: body => api.post('/riders', body),
  update: (id, body) => api.patch(`/riders/${id}`, body),
  remove: id => api.delete(`/riders/${id}`)
}
