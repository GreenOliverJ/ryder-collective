<template>
  <div v-if="hasContent" class="band-info q-mb-md">
    <div v-if="genre" class="q-mb-sm">
      <div class="text-subtitle2 q-mb-xs">
        Genre
      </div>
      <q-chip dense outline color="secondary">
        {{ genre }}
      </q-chip>
    </div>
    <div v-if="bandInfo">
      <div class="text-subtitle2 q-mb-xs">
        Band info
      </div>
      <p class="text-body2 q-mb-none">
        {{ bandInfo }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  genre: { type: String, default: '' },
  bandInfo: { type: String, default: '' }
})

const hasContent = computed(() => !!(props.genre?.trim() || props.bandInfo?.trim()))
</script>
