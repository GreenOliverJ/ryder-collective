import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function demoUploadUrl (filename) {
  return `/uploads/${filename}`
}

export async function copyDemoAssetsToUploads (uploadDir) {
  const assetsDir = path.join(__dirname, '../../demo-assets/audio')
  await fs.mkdir(uploadDir, { recursive: true })

  let entries
  try {
    entries = await fs.readdir(assetsDir)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('[demo] demo-assets/audio/ not found — skipping audio copy')
      return
    }
    throw err
  }

  for (const filename of entries) {
    if (filename.startsWith('.')) continue
    const src = path.join(assetsDir, filename)
    const stat = await fs.stat(src)
    if (!stat.isFile()) continue
    await fs.copyFile(src, path.join(uploadDir, filename))
  }
}
