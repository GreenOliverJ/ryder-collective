export const DEMO_EMAIL = 'demo@ryder.app'
export const DEMO_HANDLE = 'demo'
export const DEMO_SLUG = 'demo-gig'
export const DEMO_PASSWORD = 'demo12345'

const musicians = [
  {
    id: 'm1',
    name: 'Alex',
    instrument: 'Vocals',
    role: 'Lead',
    position: { x: 50, y: 35 },
    technicalNeeds: ['SM58', 'DI for tracks'],
    soundRequirements: 'Warm vocal, light reverb',
    monitorMix: 'Vox + click L, music R',
    usesInEar: true,
    color: '#7c4dff',
    notes: ''
  },
  {
    id: 'm2',
    name: 'Jordan',
    instrument: 'Guitar',
    role: 'Lead',
    position: { x: 30, y: 55 },
    technicalNeeds: ['SM57 on amp', 'TU3 DI'],
    soundRequirements: 'Crunch rhythm, solo boost +2dB',
    monitorMix: 'Guitar center',
    usesInEar: false,
    color: '#26a69a',
    notes: ''
  },
  {
    id: 'm3',
    name: 'Sam',
    instrument: 'Keys',
    role: '',
    position: { x: 70, y: 55 },
    technicalNeeds: ['Stereo DI', 'Power strip'],
    soundRequirements: 'Stereo keys, pad under vocals',
    monitorMix: 'Keys + vox',
    usesInEar: false,
    color: '#ff6b35',
    notes: ''
  }
]

const audioTracks = [
  { id: 't-full', label: 'Full live mix', type: 'full', musicianId: null, url: '', filename: '' },
  { id: 't1', label: 'Alex — vocal stem', type: 'individual', musicianId: 'm1', url: '', filename: '' }
]

export function getDemoRiderFields () {
  return {
    title: 'Demo Night',
    slug: DEMO_SLUG,
    bandName: 'The Ryder Collective',
    genre: 'Indie rock',
    bandInfo: '3-piece with playback tracks. Stage power on SR.',
    description: 'Example published tech rider — tap musicians on stage and explore the layout.',
    isPublished: true,
    stage: { width: 800, height: 500, audienceSide: 'bottom' },
    musicians,
    audioTracks
  }
}

export function getDemoShowcaseMeta () {
  const fields = getDemoRiderFields()
  return {
    handle: DEMO_HANDLE,
    slug: DEMO_SLUG,
    title: fields.title,
    bandName: fields.bandName,
    genre: fields.genre,
    description: fields.description
  }
}
