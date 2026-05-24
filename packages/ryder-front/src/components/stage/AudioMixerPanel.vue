<template>
  <div class="audio-panel q-pa-md">
    <div class="text-subtitle2 q-mb-sm">
      Audio mixes
    </div>
    <div v-if="!tracks.length" class="text-grey-6 text-caption">
      No audio tracks yet.
    </div>

    <q-list v-else separator dark class="audio-panel__list">
      <q-item v-for="track in tracks" :key="track.id" class="audio-panel__item q-px-none">
        <q-item-section avatar top>
          <q-icon :name="track.type === 'full' ? 'surround_sound' : 'person'" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ track.label }}</q-item-label>
          <q-item-label v-if="trackMusicianLine(track)" caption class="audio-panel__musician-line">
            {{ trackMusicianLine(track) }}
          </q-item-label>
          <audio
            v-if="resolveAudioUrl(track.url)"
            :ref="el => setAudioRef(track.id, el)"
            :src="resolveAudioUrl(track.url)"
            preload="metadata"
            class="q-mt-sm full-width"
            controls
            @play="onPlay(track.id)"
          />
          <div v-else class="text-grey-6 text-caption q-mt-sm">
            No file uploaded
          </div>
        </q-item-section>
        <q-item-section v-if="editable" side top>
          <q-btn flat round dense icon="delete" color="negative" @click="emit('remove', track.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="editable" class="row q-gutter-sm q-mt-md">
      <q-btn outline size="sm" icon="add" label="Stem" @click="emit('add-individual')" />
      <q-btn outline size="sm" icon="album" label="Full mix" @click="emit('add-full')" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { resolveAudioUrl } from 'src/utils/audio-url'
import { formatInstruments } from 'src/utils/instruments'

const props = defineProps({
  tracks: { type: Array, default: () => [] },
  musicians: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['remove', 'add-individual', 'add-full'])

const audioRefs = ref({})

function setAudioRef (id, el) {
  if (el) audioRefs.value[id] = el
}

function trackMusician (track) {
  if (!track.musicianId) return null
  return props.musicians.find(m => m.id === track.musicianId) ?? null
}

function trackMusicianLine (track) {
  const m = trackMusician(track)
  if (!m) return ''
  const inst = formatInstruments(m.instrument)
  return inst ? `${m.name} · ${inst}` : m.name
}

function onPlay (activeId) {
  Object.entries(audioRefs.value).forEach(([id, el]) => {
    if (id !== activeId && el && !el.paused) el.pause()
  })
}
</script>
