import bcrypt from 'bcryptjs'
import { connectDatabase } from '../src/config/database.js'
import { User } from '../src/models/User.js'
import { Rider } from '../src/models/Rider.js'
import { uniquePublicId } from '../src/utils/slug.js'

async function seed () {
  await connectDatabase()

  const email = 'demo@ryder.app'
  let user = await User.findOne({ email })
  if (!user) {
    user = await User.create({
      email,
      passwordHash: await bcrypt.hash('demo12345', 12),
      displayName: 'Demo Band',
      handle: 'demo'
    })
    console.log('Created demo user (demo@ryder.app / demo12345)')
  }

  const slug = 'demo-gig'
  let rider = await Rider.findOne({ ownerId: user._id, slug })
  if (!rider) {
    const m1 = { id: 'm1', name: 'Alex', instrument: 'Vocals', role: 'Lead', position: { x: 50, y: 35 }, technicalNeeds: ['SM58', 'DI for tracks'], soundRequirements: 'Warm vocal, light reverb', monitorMix: 'Vox + click L, music R', usesInEar: true, color: '#7c4dff', notes: '' }
    const m2 = { id: 'm2', name: 'Jordan', instrument: 'Guitar', role: 'Lead', position: { x: 30, y: 55 }, technicalNeeds: ['SM57 on amp', 'TU3 DI'], soundRequirements: 'Crunch rhythm, solo boost +2dB', monitorMix: 'Guitar center', color: '#26a69a', notes: '' }
    const m3 = { id: 'm3', name: 'Sam', instrument: 'Keys', role: '', position: { x: 70, y: 55 }, technicalNeeds: ['Stereo DI', 'Power strip'], soundRequirements: 'Stereo keys, pad under vocals', monitorMix: 'Keys + vox', color: '#ff6b35', notes: '' }

    rider = await Rider.create({
      ownerId: user._id,
      title: 'Demo Night',
      slug,
      bandName: 'The Ryder Collective',
      genre: 'Indie rock',
      bandInfo: '3-piece with playback tracks. Stage power on SR.',
      description: 'Example published tech rider — tap musicians and explore the layout.',
      isPublished: true,
      publicId: uniquePublicId(),
      stage: { width: 800, height: 500, audienceSide: 'bottom' },
      musicians: [m1, m2, m3],
      audioTracks: [
        { id: 't-full', label: 'Full live mix', type: 'full', musicianId: null, url: '', filename: '' },
        { id: 't1', label: 'Alex — vocal stem', type: 'individual', musicianId: 'm1', url: '', filename: '' }
      ]
    })
    console.log('Created demo rider')
  }

  console.log(`Public stage: http://localhost:9000/stage/demo/${slug}`)
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
