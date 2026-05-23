<template>
  <div
    ref="surfaceRef"
    class="stage-surface"
    :style="{ width: width + 'px', height: height + 'px', maxWidth: '100%' }"
    @click="onStageClick"
  >
    <div
      class="stage-audience"
      :class="audienceSide === 'bottom' ? 'stage-audience--bottom' : 'stage-audience--top'"
    >
      Audience
    </div>

    <div
      v-for="m in musicians"
      :key="m.id"
      class="musician-marker"
      :class="{ 'musician-marker--selected': m.id === selectedId }"
      :style="markerStyle(m)"
      @click.stop="emit('select', m.id)"
      @pointerdown.stop="editable && startDrag($event, m)"
    >
      <div class="musician-marker__dot" :style="{ background: m.color }">
        {{ initials(m.name) }}
      </div>
      <div class="musician-marker__label">
        {{ m.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  musicians: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
  width: { type: Number, default: 800 },
  height: { type: Number, default: 500 },
  audienceSide: { type: String, default: 'bottom' },
  editable: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'move', 'deselect'])

const surfaceRef = ref(null)
let drag = null

function initials (name) {
  return (name || '?')
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function markerStyle (m) {
  return {
    left: `${m.position?.x ?? 50}%`,
    top: `${m.position?.y ?? 50}%`
  }
}

function onStageClick () {
  emit('deselect')
}

function startDrag (event, musician) {
  if (!props.editable || !surfaceRef.value) return
  const rect = surfaceRef.value.getBoundingClientRect()
  drag = { id: musician.id, rect }

  const onMove = e => {
    if (!drag) return
    const x = ((e.clientX - drag.rect.left) / drag.rect.width) * 100
    const y = ((e.clientY - drag.rect.top) / drag.rect.height) * 100
    emit('move', {
      id: drag.id,
      position: {
        x: Math.min(96, Math.max(4, x)),
        y: Math.min(92, Math.max(8, y))
      }
    })
  }

  const onUp = () => {
    drag = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>
