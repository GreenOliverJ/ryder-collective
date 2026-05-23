import mongoose from 'mongoose'

const positionSchema = new mongoose.Schema(
  { x: { type: Number, default: 50 }, y: { type: Number, default: 50 } },
  { _id: false }
)

const musicianSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    instrument: { type: String, default: '' },
    role: { type: String, default: '' },
    position: { type: positionSchema, default: () => ({}) },
    technicalNeeds: [{ type: String }],
    soundRequirements: { type: String, default: '' },
    monitorMix: { type: String, default: '' },
    color: { type: String, default: '#7c4dff' },
    notes: { type: String, default: '' }
  },
  { _id: false }
)

const audioTrackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['full', 'individual'], default: 'individual' },
    musicianId: { type: String, default: null },
    url: { type: String, default: '' },
    filename: { type: String, default: '' }
  },
  { _id: false }
)

const stageSchema = new mongoose.Schema(
  {
    width: { type: Number, default: 800 },
    height: { type: Number, default: 500 },
    label: { type: String, default: 'Stage' },
    audienceSide: { type: String, enum: ['bottom', 'top'], default: 'bottom' }
  },
  { _id: false }
)

const riderSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    bandName: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    stage: { type: stageSchema, default: () => ({}) },
    musicians: [musicianSchema],
    audioTracks: [audioTrackSchema],
    publicId: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
)

riderSchema.index({ ownerId: 1, slug: 1 }, { unique: true })
riderSchema.index({ isPublished: 1 })

export const Rider = mongoose.model('Rider', riderSchema)
