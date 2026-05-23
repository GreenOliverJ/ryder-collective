<template>
  <div v-if="musician" class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-avatar :style="{ background: musician.color }" text-color="white" size="48px">
        {{ initials }}
      </q-avatar>
      <div class="q-ml-md col">
        <div class="text-h6">
          {{ musician.name }}
        </div>
        <div class="text-caption text-grey-5">
          {{ musician.instrument || 'Instrument' }}
          <span v-if="musician.role"> · {{ musician.role }}</span>
        </div>
      </div>
      <q-btn v-if="editable" flat round icon="close" @click="emit('close')" />
    </div>

    <template v-if="editable">
      <q-input v-model="local.name" dense filled label="Name" class="q-mb-sm" @update:model-value="sync" />
      <q-input v-model="local.instrument" dense filled label="Instrument" class="q-mb-sm" @update:model-value="sync" />
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
      <q-input v-model="local.monitorMix" dense filled label="Monitor mix" class="q-mb-sm" @update:model-value="sync" />
      <q-input v-model="local.notes" type="textarea" autogrow dense filled label="Notes" class="q-mb-md" @update:model-value="sync" />
      <q-btn flat color="negative" icon="delete" label="Remove musician" @click="emit('remove')" />
    </template>

    <template v-else>
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
        <div class="text-subtitle2 q-mb-xs">
          Monitor mix
        </div>
        <p class="text-body2">
          {{ musician.monitorMix }}
        </p>
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

const props = defineProps({
  musician: { type: Object, default: null },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['update', 'remove', 'close'])

const local = ref({})
const techNeedsText = ref('')

const initials = computed(() =>
  (props.musician?.name || '?')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

watch(
  () => props.musician,
  m => {
    if (!m) return
    local.value = { ...m }
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
</script>

<style scoped>
.color-input {
  width: 36px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
}
</style>
