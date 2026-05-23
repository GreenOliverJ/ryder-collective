import { api } from 'src/boot/axios'

export function uploadTrackAudio (riderId, trackId, file, onProgress) {
  const form = new FormData()
  form.append('audio', file)
  return api.post(`/uploads/${riderId}/tracks/${trackId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    }
  })
}
