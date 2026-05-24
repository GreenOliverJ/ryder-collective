import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const DEMO_AUDIO_FILES = [
  'demo-full-mix.mp3',
  'demo-drums.wav',
  'demo-vocals.wav',
  'demo-guitar.wav',
  'demo-keys.wav'
]

export function demoUploadUrl (filename) {
  return `/uploads/${filename}`
}

export async function copyDemoAssetsToUploads (uploadDir) {
  const assetsDir = path.join(__dirname, '../../demo-assets/audio')
  await fs.mkdir(uploadDir, { recursive: true })

  for (const filename of DEMO_AUDIO_FILES) {
    const src = path.join(assetsDir, filename)
    const dest = path.join(uploadDir, filename)
    try {
      await fs.copyFile(src, dest)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.warn(`[demo] missing asset ${filename} — run from repo with demo-assets/audio/`)
      } else {
        throw err
      }
    }
  }
}
