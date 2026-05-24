import { demoUploadUrl } from './demoAssets.js'

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
    position: { x: 50, y: 62 },
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
    position: { x: 28, y: 48 },
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
    instrument: 'Bass',
    role: '',
    position: { x: 72, y: 48 },
    technicalNeeds: ['Stereo DI', 'Power strip'],
    soundRequirements: 'Line output, pad under vocals',
    monitorMix: 'Bass + vox + click',
    usesInEar: false,
    color: '#ff6b35',
    notes: ''
  },
  {
    id: 'm4',
    name: 'Casey',
    instrument: 'Drums',
    role: '',
    position: { x: 50, y: 29 },
    technicalNeeds: ['Kick/Snare/OH mics', 'Drum rug'],
    soundRequirements: 'Punchy kick, crisp snare',
    monitorMix: 'Click + bass + vox',
    usesInEar: true,
    color: '#ffd54f',
    notes: ''
  }
]

const audioTracks = [
  {
    id: 't-full',
    label: 'Full live mix',
    type: 'full',
    musicianId: null,
    url: demoUploadUrl('full-mix.wav'),
    filename: 'full-mix.wav'
  },
  {
    id: 't1',
    label: 'Alex — vocals',
    type: 'individual',
    musicianId: 'm1',
    url: demoUploadUrl('demo-vocals.wav'),
    filename: 'demo-vocals.wav'
  },
  {
    id: 't2',
    label: 'Jordan — guitar',
    type: 'individual',
    musicianId: 'm2',
    url: demoUploadUrl('demo-guitar.wav'),
    filename: 'demo-guitar.wav'
  },
  {
    id: 't3',
    label: 'Sam — bass',
    type: 'individual',
    musicianId: 'm3',
    url: demoUploadUrl('demo-bass.wav'),
    filename: 'demo-bass.wav'
  },
  {
    id: 't4',
    label: 'Casey — drums',
    type: 'individual',
    musicianId: 'm4',
    url: demoUploadUrl('demo-drums.wav'),
    filename: 'drums.wav'
  }
]

export function getDemoRiderFields () {
  return {
    title: 'Demo Night',
    slug: DEMO_SLUG,
    bandName: 'The Ryder Collective',
    genre: 'Indie rock',
    bandInfo: '4-piece with playback tracks. Stage power on SR.',
    description: 'Example published tech rider — tap musicians on stage, play the full mix or individual stems.',
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
