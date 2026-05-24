import { api } from 'src/services/api-client'

export const publicApi = {
  showcase: () => api.get('/public/demo'),
  byHandleSlug: (handle, slug) => api.get(`/public/stage/${handle}/${slug}`),
  byPublicId: publicId => api.get(`/public/s/${publicId}`)
}
