import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { createApp } from './app.js'
import { demoService } from './services/demoService.js'

async function main () {
  await connectDatabase()
  try {
    await demoService.ensureDemoSeed()
  } catch (err) {
    console.error('[demo] failed to ensure showcase rider:', err.message)
  }
  const app = await createApp()
  app.listen(env.port, () => {
    console.log(`[server] Ryder API listening on http://localhost:${env.port}`)
  })
}

main().catch(err => {
  console.error('[fatal]', err)
  process.exit(1)
})
