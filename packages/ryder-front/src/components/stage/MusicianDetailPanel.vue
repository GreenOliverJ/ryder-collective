<template>
  <div
    v-if="musician"
    class="musician-detail-panel"
    :class="{ 'musician-detail-panel--selected': selected }"
  >
    <div class="row items-center q-mb-md">
      <q-avatar :style="{ background: musician.color }" text-color="white" size="48px">
        {{ initials }}
      </q-avatar>
      <div class="q-ml-md col">
        <div class="text-h6">
          {{ musician.name }}
        </div>
        <div v-if="instruments.length" class="musician-detail-panel__instruments q-mt-xs">
          <q-chip
            v-for="(inst, i) in instruments"
            :key="i"
            dense
            outline
            color="grey-6"
            class="q-ma-none q-mr-xs q-mb-xs"
          >
            {{ inst }}
          </q-chip>
        </div>
        <div v-else class="text-caption text-grey-5">
          Instrument
        </div>
        <div v-if="musician.role" class="text-caption text-grey-6">
          {{ musician.role }}
        </div>
      </div>
      <q-btn v-if="editable" flat round icon="close" @click="emit('close')" />
    </div>

    <template v-if="editable">
      <q-input v-model="local.name" dense filled label="Name" class="q-mb-sm" @update:model-value="sync" />
      <q-input
        v-model="local.instrument"
        dense
        filled
        label="Instrument(s)"
        hint="Comma-separated for multiple"
        class="q-mb-sm"
        @update:model-value="sync"
      />
      <q-input v-model="local.role" dense filled label="Role" class="q-mb-sm" @update:model-value="sync" />
      <q-input v-model="local.color" dense filled label="Marker color" class="q-mb-sm" @update:model-value="sync">
        <template #append>
          <input v-model="local.color" type="color" class="color-input" @input="sync">
        </template>
      </q-input>
      <q-input
        v-model="techNeedsText"
        type="textarea"
        autogrow
        dense
        filled
        label="Technical needs (one per line)"
        class="q-mb-sm"
        @update:model-value="syncTech"
      />
      <q-input v-model="local.soundRequirements" type="textarea" autogrow dense filled label="FOH / sound requirements" class="q-mb-sm" @update:model-value="sync" />
      <q-toggle
        v-model="local.usesInEar"
        label="Uses in-ear monitors"
        color="primary"
        class="q-mb-sm"
        @update:model-value="sync"
      />
      <q-input v-model="local.monitorMix" dense filled label="Monitor mix" class="q-mb-sm" @update:model-value="sync" />
      <q-input v-model="local.notes" type="textarea" autogrow dense filled label="Notes" class="q-mb-md" @update:model-value="sync" />
      <q-btn flat color="negative" icon="delete" label="Remove musician" @click="emit('remove')" />
    </template>

    <template v-else>
      <div v-if="musicianTracks.length" class="q-mb-md">
        <div class="text-subtitle2 q-mb-xs">
          Audio
        </div>
        <div v-for="track in musicianTracks" :key="track.id" class="q-mb-sm">
          <div class="text-caption text-grey-5 q-mb-xs">
            {{ track.label }}
          </div>
          <audio
            v-if="resolveAudioUrl(track.url)"
            :ref="el => setAudioRef(track.id, el)"
            :src="resolveAudioUrl(track.url)"
            preload="metadata"
            class="full-width"
            controls
            @play="onPlay(track.id)"
          />
        </div>
      </div>

      <div v-if="musician.technicalNeeds?.length" class="q-mb-md">
        <div class="text-subtitle2 q-mb-xs">
          Technical needs
        </div>
        <q-chip v-for="(item, i) in musician.technicalNeeds" :key="i" dense outline color="primary">
          {{ item }}
        </q-chip>
      </div>
      <div v-if="musician.soundRequirements" class="q-mb-md">
        <div class="text-subtitle2 q-mb-xs">
          Sound (FOH)
        </div>
        <p class="text-body2">
          {{ musician.soundRequirements }}
        </p>
      </div>
      <div v-if="musician.monitorMix" class="q-mb-md">
        <div class="row items-center q-gutter-xs q-mb-xs">
          <div class="text-subtitle2">
            Monitor mix
          </div>
          <q-chip
            v-if="musician.usesInEar"
            dense
            size="sm"
            color="accent"
            text-color="white"
          >
            In-ear
          </q-chip>
        </div>
        <p class="text-body2">
          {{ musician.monitorMix }}
        </p>
      </div>
      <div v-else-if="musician.usesInEar" class="q-mb-md">
        <div class="row items-center q-gutter-xs q-mb-xs">
          <div class="text-subtitle2">
            Monitor mix
          </div>
          <q-chip dense size="sm" color="accent" text-color="white">
            In-ear
          </q-chip>
        </div>
      </div>
      <div v-if="musician.notes">
        <div class="text-subtitle2 q-mb-xs">
          Notes
        </div>
        <p class="text-body2">
          {{ musician.notes }}
        </p>
      </div>
    </template>
  </div>
  <div v-else class="q-pa-lg text-center text-grey-6">
    Select a musician on stage
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { parseInstruments } from 'src/utils/instruments'
import { resolveAudioUrl } from 'src/utils/audio-url'

const props = defineProps({
  musician: { type: Object, default: null },
  tracks: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false },
  selected: { type: Boolean, default: true }
})

const emit = defineEmits(['update', 'remove', 'close'])

const local = ref({})
const techNeedsText = ref('')
const audioRefs = ref({})

const initials = computed(() =>
  (props.musician?.name || '?')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

const instruments = computed(() => parseInstruments(props.musician?.instrument))

const musicianTracks = computed(() =>
  props.tracks.filter(t => t.musicianId === props.musician?.id && resolveAudioUrl(t.url))
)

watch(
  () => props.musician,
  m => {
    if (!m) return
    local.value = { ...m, usesInEar: !!m.usesInEar }
    techNeedsText.value = (m.technicalNeeds || []).join('\n')
  },
  { immediate: true, deep: true }
)

function sync () {
  emit('update', { ...local.value })
}

function syncTech () {
  local.value.technicalNeeds = techNeedsText.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
  sync()
}

function setAudioRef (id, el) {
  if (el) audioRefs.value[id] = el
}

function onPlay (activeId) {
  Object.entries(audioRefs.value).forEach(([id, el]) => {
    if (id !== activeId && el && !el.paused) el.pause()
  })
}
</script>

<style scoped>
.color-input {
  width: 36px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.musician-detail-panel {
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.musician-detail-panel--selected {
  box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.65);
}

.musician-detail-panel__instruments {
  display: flex;
  flex-wrap: wrap;
}
</style>
