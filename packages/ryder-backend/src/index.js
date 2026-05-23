import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { createApp } from './app.js'

async function main () {
  await connectDatabase()
  const app = await createApp()
  app.listen(env.port, () => {
    console.log(`[server] Ryder API listening on http://localhost:${env.port}`)
  })
}

main().catch(err => {
  console.error('[fatal]', err)
  process.exit(1)
})
