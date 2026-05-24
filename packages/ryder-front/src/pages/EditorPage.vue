<template>
  <q-page class="q-pa-md stage-view-page">
    <q-inner-loading :showing="store.loading" />

    <q-banner v-if="store.loadError" class="bg-negative text-white q-mb-md" rounded>
      {{ store.loadError }}
      <template #action>
        <q-btn flat label="Back" to="/dashboard" />
      </template>
    </q-banner>

    <template v-else-if="store.rider">
      <div class="row items-center q-mb-md q-gutter-sm">
        <q-btn flat round icon="arrow_back" to="/dashboard" />
        <q-input
          v-model="store.rider.title"
          dense
          borderless
          class="text-h6 col"
          @update:model-value="store.markDirty()"
        />
        <q-chip v-if="store.dirty" dense color="warning" text-color="dark">
          Unsaved
        </q-chip>
        <q-toggle
          v-model="store.rider.isPublished"
          label="Published"
          color="positive"
          @update:model-value="store.markDirty()"
        />
        <q-btn unelevated color="primary" label="Save" :loading="store.saving" @click="save" />
      </div>

      <q-banner v-if="store.rider.isPublished" dense rounded class="bg-primary text-white q-mb-md">
        Public URL:
        <router-link
          class="text-white text-weight-bold"
          :to="{ name: 'stage-public', params: { handle: auth.user?.handle, slug: store.rider.slug } }"
        >
          /stage/{{ auth.user?.handle }}/{{ store.rider.slug }}
        </router-link>
        <span v-if="store.rider.publicId" class="q-ml-md">
          Short: /s/{{ store.rider.publicId }}
        </span>
      </q-banner>

      <div class="text-subtitle2 q-mb-sm">
        Band &amp; gig info
      </div>
      <div class="row q-col-gutter-sm q-mb-md">
        <q-input
          v-model="store.rider.bandName"
          dense
          filled
          label="Band name"
          class="col-12 col-sm-6 col-md-3"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.genre"
          dense
          filled
          label="Genre"
          class="col-12 col-sm-6 col-md-3"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.slug"
          dense
          filled
          label="URL slug"
          hint="Used in public link"
          class="col-12 col-sm-6 col-md-3"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.description"
          dense
          filled
          label="Gig description"
          class="col-12 col-sm-6 col-md-3"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.bandInfo"
          type="textarea"
          autogrow
          dense
          filled
          label="General band info"
          hint="Lineup, contact, notes for the crew"
          class="col-12"
          @update:model-value="store.markDirty()"
        />
      </div>

      <div class="stage-page-layout">
        <q-card flat bordered class="bg-dark q-pa-md stage-page-layout__stage">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle1 col">
              Stage layout
            </div>
            <q-btn outline size="sm" icon="person_add" label="Add musician" @click="onAddMusician" />
          </div>
          <StageCanvas
            :musicians="store.musicians"
            :selected-id="store.selectedMusicianId"
            :width="store.rider.stage?.width || 800"
            :height="store.rider.stage?.height || 500"
            :audience-side="store.rider.stage?.audienceSide || 'bottom'"
            editable
            @select="onSelectMusician"
            @move="({ id, position }) => store.moveMusician(id, position)"
            @deselect="store.selectedMusicianId = null"
          />
        </q-card>

        <div ref="musicianPanelRef" class="stage-page-layout__panel">
          <q-card flat bordered class="bg-dark">
            <MusicianDetailPanel
              :musician="store.selectedMusician"
              :tracks="store.audioTracks"
              editable
              selected
              @update="patch => store.selectedMusician && store.updateMusician(store.selectedMusician.id, patch)"
              @remove="store.selectedMusician && store.removeMusician(store.selectedMusician.id)"
              @close="store.selectedMusicianId = null"
            />
          </q-card>
        </div>

        <EditorAudioSection class="stage-page-layout__audio" />
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { useRiderEditorStore } from 'src/stores/rider-editor-store'
import StageCanvas from 'src/components/stage/StageCanvas.vue'
import MusicianDetailPanel from 'src/components/stage/MusicianDetailPanel.vue'
import EditorAudioSection from 'src/components/editor/EditorAudioSection.vue'

const route = useRoute()
const $q = useQuasar()
const auth = useAuthStore()
const store = useRiderEditorStore()
const musicianPanelRef = ref(null)

onMounted(() => loadRider())

watch(() => route.params.id, () => loadRider())

async function loadRider () {
  try {
    await store.load(route.params.id)
  } catch {
    // loadError shown in template
  }
}

function onSelectMusician (id) {
  store.selectedMusicianId = id
  if ($q.screen.lt.lg) {
    requestAnimationFrame(() => {
      musicianPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

function onAddMusician () {
  store.addMusician()
  if ($q.screen.lt.lg) {
    requestAnimationFrame(() => {
      musicianPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

async function save () {
  try {
    await store.save()
    $q.notify({ type: 'positive', message: 'Rider saved' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Save failed' })
  }
}
</script>
