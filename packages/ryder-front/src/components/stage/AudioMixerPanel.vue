<template>
  <div class="audio-panel q-pa-md">
    <div class="text-subtitle2 q-mb-sm">
      Audio mixes
    </div>
    <div v-if="!tracks.length" class="text-grey-6 text-caption">
      No audio tracks yet.
    </div>

    <q-list v-else dense separator dark>
      <q-item v-for="track in tracks" :key="track.id" class="q-px-none">
        <q-item-section avatar>
          <q-icon :name="track.type === 'full' ? 'surround_sound' : 'person'" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ track.label }}</q-item-label>
          <q-item-label v-if="trackMusicianName(track)" caption>
            {{ trackMusicianName(track) }}
          </q-item-label>
          <audio
            v-if="resolveAudioUrl(track.url)"
            :ref="el => setAudioRef(track.id, el)"
            :src="resolveAudioUrl(track.url)"
            preload="metadata"
            class="q-mt-xs full-width"
            controls
            @play="onPlay(track.id)"
          />
          <div v-else class="text-grey-6 text-caption q-mt-xs">
            No file uploaded
          </div>
        </q-item-section>
        <q-item-section v-if="editable" side>
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

function trackMusicianName (track) {
  if (!track.musicianId) return ''
  return props.musicians.find(m => m.id === track.musicianId)?.name ?? ''
}

function onPlay (activeId) {
  Object.entries(audioRefs.value).forEach(([id, el]) => {
    if (id !== activeId && el && !el.paused) el.pause()
  })
}
</script>
