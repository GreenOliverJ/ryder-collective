<template>
  <q-card flat bordered class="bg-dark q-pa-md">
    <AudioMixerPanel
      :tracks="store.audioTracks"
      :musicians="store.musicians"
      editable
      @add-individual="addIndividual"
      @add-full="store.addAudioTrack('full')"
      @remove="store.removeAudioTrack"
    />

    <q-separator dark class="q-my-md" />

    <div v-for="track in store.audioTracks" :key="track.id" class="q-mb-md">
      <div class="row q-col-gutter-sm items-end">
        <q-input
          :model-value="track.label"
          dense
          filled
          label="Track label"
          class="col"
          @update:model-value="v => store.updateAudioTrack(track.id, { label: v })"
        />
        <q-select
          v-if="track.type === 'individual'"
          :model-value="track.musicianId"
          :options="musicianOptions"
          emit-value
          map-options
          dense
          filled
          label="Musician"
          class="col"
          @update:model-value="v => store.updateAudioTrack(track.id, { musicianId: v })"
        />
        <q-file
          dense
          filled
          label="Upload audio"
          accept="audio/*"
          class="col"
          @update:model-value="file => file && upload(track.id, file)"
        />
      </div>
      <q-linear-progress v-if="uploadProgress[track.id] != null" :value="uploadProgress[track.id] / 100" class="q-mt-xs" />
    </div>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRiderEditorStore } from 'src/stores/rider-editor-store'
import AudioMixerPanel from 'src/components/stage/AudioMixerPanel.vue'
import { uploadTrackAudio } from 'src/services/uploads-api'

const $q = useQuasar()
const store = useRiderEditorStore()
const uploadProgress = ref({})

const musicianOptions = computed(() =>
  store.musicians.map(m => ({ label: m.name, value: m.id }))
)

function addIndividual () {
  const id = store.selectedMusicianId || store.musicians[0]?.id
  store.addAudioTrack('individual', id)
}

async function upload (trackId, file) {
  if (!store.rider?._id) return
  uploadProgress.value[trackId] = 0
  try {
    const { data } = await uploadTrackAudio(
      store.rider._id,
      trackId,
      file,
      p => { uploadProgress.value[trackId] = p }
    )
    store.rider = data.rider
    $q.notify({ type: 'positive', message: 'Audio uploaded' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Upload failed' })
  } finally {
    delete uploadProgress.value[trackId]
  }
}
</script>
