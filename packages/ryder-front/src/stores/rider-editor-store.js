import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ridersApi } from 'src/services/riders-api'
import { randomId } from 'src/utils/id'

export const useRiderEditorStore = defineStore('riderEditor', () => {
  const rider = ref(null)
  const urls = ref({})
  const loading = ref(false)
  const saving = ref(false)
  const selectedMusicianId = ref(null)
  const dirty = ref(false)

  const musicians = computed(() => rider.value?.musicians ?? [])
  const audioTracks = computed(() => rider.value?.audioTracks ?? [])
  const selectedMusician = computed(() =>
    musicians.value.find(m => m.id === selectedMusicianId.value) ?? null
  )

  function markDirty () {
    dirty.value = true
  }

  async function load (id) {
    loading.value = true
    try {
      const { data } = await ridersApi.get(id)
      rider.value = data.rider
      urls.value = data.urls || {}
      selectedMusicianId.value = data.rider.musicians?.[0]?.id ?? null
      dirty.value = false
    } finally {
      loading.value = false
    }
  }

  async function save () {
    if (!rider.value?._id) return
    saving.value = true
    try {
      const payload = {
        title: rider.value.title,
        slug: rider.value.slug,
        bandName: rider.value.bandName,
        description: rider.value.description,
        isPublished: rider.value.isPublished,
        stage: rider.value.stage,
        musicians: rider.value.musicians,
        audioTracks: rider.value.audioTracks
      }
      const { data } = await ridersApi.update(rider.value._id, payload)
      rider.value = data.rider
      urls.value = data.urls || {}
      dirty.value = false
      return data.rider
    } finally {
      saving.value = false
    }
  }

  function addMusician () {
    const m = {
      id: randomId(),
      name: 'New musician',
      instrument: '',
      role: '',
      position: { x: 50, y: 50 },
      technicalNeeds: [],
      soundRequirements: '',
      monitorMix: '',
      color: '#7c4dff',
      notes: ''
    }
    rider.value.musicians = [...(rider.value.musicians || []), m]
    selectedMusicianId.value = m.id
    markDirty()
  }

  function removeMusician (id) {
    rider.value.musicians = rider.value.musicians.filter(m => m.id !== id)
    rider.value.audioTracks = rider.value.audioTracks.filter(
      t => t.musicianId !== id
    )
    if (selectedMusicianId.value === id) {
      selectedMusicianId.value = rider.value.musicians[0]?.id ?? null
    }
    markDirty()
  }

  function updateMusician (id, patch) {
    rider.value.musicians = rider.value.musicians.map(m =>
      m.id === id ? { ...m, ...patch } : m
    )
    markDirty()
  }

  function moveMusician (id, position) {
    updateMusician(id, { position })
  }

  function addAudioTrack (type = 'individual', musicianId = null) {
    const track = {
      id: randomId(),
      label: type === 'full' ? 'Full live mix' : 'Stem',
      type,
      musicianId,
      url: '',
      filename: ''
    }
    rider.value.audioTracks = [...(rider.value.audioTracks || []), track]
    markDirty()
    return track
  }

  function removeAudioTrack (id) {
    rider.value.audioTracks = rider.value.audioTracks.filter(t => t.id !== id)
    markDirty()
  }

  function updateAudioTrack (id, patch) {
    rider.value.audioTracks = rider.value.audioTracks.map(t =>
      t.id === id ? { ...t, ...patch } : t
    )
    markDirty()
  }

  return {
    rider,
    urls,
    loading,
    saving,
    dirty,
    selectedMusicianId,
    musicians,
    audioTracks,
    selectedMusician,
    load,
    save,
    markDirty,
    addMusician,
    removeMusician,
    updateMusician,
    moveMusician,
    addAudioTrack,
    removeAudioTrack,
    updateAudioTrack
  }
})
