<template>
  <q-page class="q-pa-md">
    <q-inner-loading :showing="store.loading" />

    <template v-if="store.rider">
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
          :to="{ name: 'stage-public', params: { handle: auth.user.handle, slug: store.rider.slug } }"
        >
          /stage/{{ auth.user.handle }}/{{ store.rider.slug }}
        </router-link>
        <span v-if="store.rider.publicId" class="q-ml-md">
          Short: /s/{{ store.rider.publicId }}
        </span>
      </q-banner>

      <div class="row q-col-gutter-sm q-mb-md">
        <q-input
          v-model="store.rider.bandName"
          dense
          filled
          label="Band name"
          class="col-12 col-sm-4"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.slug"
          dense
          filled
          label="URL slug"
          hint="Used in public link"
          class="col-12 col-sm-4"
          @update:model-value="store.markDirty()"
        />
        <q-input
          v-model="store.rider.description"
          dense
          filled
          label="Description"
          class="col-12 col-sm-4"
          @update:model-value="store.markDirty()"
        />
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-8">
          <q-card flat bordered class="bg-dark q-pa-md">
            <div class="row items-center q-mb-md">
              <div class="text-subtitle1 col">
                Stage layout
              </div>
              <q-btn outline size="sm" icon="person_add" label="Add musician" @click="store.addMusician()" />
            </div>
            <div class="flex flex-center">
              <StageCanvas
                :musicians="store.musicians"
                :selected-id="store.selectedMusicianId"
                :width="store.rider.stage?.width || 800"
                :height="store.rider.stage?.height || 500"
                :audience-side="store.rider.stage?.audienceSide || 'bottom'"
                editable
                @select="id => (store.selectedMusicianId = id)"
                @move="({ id, position }) => store.moveMusician(id, position)"
                @deselect="store.selectedMusicianId = null"
              />
            </div>
          </q-card>

          <EditorAudioSection class="q-mt-md" />
        </div>

        <div class="col-12 col-lg-4">
          <q-card flat bordered class="bg-dark">
            <MusicianDetailPanel
              :musician="store.selectedMusician"
              editable
              @update="patch => store.selectedMusician && store.updateMusician(store.selectedMusician.id, patch)"
              @remove="store.selectedMusician && store.removeMusician(store.selectedMusician.id)"
              @close="store.selectedMusicianId = null"
            />
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
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

onMounted(() => store.load(route.params.id))

watch(() => route.params.id, id => store.load(id))

async function save () {
  try {
    await store.save()
    $q.notify({ type: 'positive', message: 'Rider saved' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Save failed' })
  }
}
</script>
