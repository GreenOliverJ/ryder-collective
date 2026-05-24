import { connectDatabase } from '../src/config/database.js'
import { demoService } from '../src/services/demoService.js'
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_HANDLE, DEMO_SLUG } from '../src/data/demoRider.js'

async function seed () {
  await connectDatabase()
  await demoService.ensureDemoSeed()
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  console.log(`Public stage: http://localhost:9000/stage/${DEMO_HANDLE}/${DEMO_SLUG}`)
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
