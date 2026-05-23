import { api } from 'src/boot/axios'

export const publicApi = {
  byHandleSlug: (handle, slug) => api.get(`/public/stage/${handle}/${slug}`),
  byPublicId: publicId => api.get(`/public/s/${publicId}`)
}
