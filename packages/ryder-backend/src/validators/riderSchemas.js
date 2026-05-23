import { z } from 'zod'

const positionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100)
})

const musicianSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  instrument: z.string().optional().default(''),
  role: z.string().optional().default(''),
  position: positionSchema.optional(),
  technicalNeeds: z.array(z.string()).optional().default([]),
  soundRequirements: z.string().optional().default(''),
  monitorMix: z.string().optional().default(''),
  color: z.string().optional().default('#7c4dff'),
  notes: z.string().optional().default('')
})

const audioTrackSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['full', 'individual']),
  musicianId: z.string().nullable().optional(),
  url: z.string().optional().default(''),
  filename: z.string().optional().default('')
})

const stageSchema = z.object({
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  label: z.string().optional(),
  audienceSide: z.enum(['bottom', 'top']).optional()
})

export const createRiderSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(80).optional(),
  bandName: z.string().max(120).optional(),
  description: z.string().max(2000).optional()
})

export const updateRiderSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(80).optional(),
  bandName: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
  isPublished: z.boolean().optional(),
  stage: stageSchema.optional(),
  musicians: z.array(musicianSchema).optional(),
  audioTracks: z.array(audioTrackSchema).optional()
})
