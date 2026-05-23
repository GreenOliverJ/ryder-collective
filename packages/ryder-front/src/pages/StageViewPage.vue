<template>
  <q-layout view="hHh lpR lFf" class="bg-dark-page">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <q-chip v-if="owner" dense outline color="primary">
          @{{ owner.handle }}
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <q-inner-loading :showing="loading" />

        <template v-if="rider">
          <p v-if="rider.description" class="text-body2 text-grey-5 q-mb-md">
            {{ rider.description }}
          </p>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-lg-8">
              <q-card flat bordered class="bg-dark q-pa-md">
                <div class="flex flex-center">
                  <StageCanvas
                    :musicians="rider.musicians"
                    :selected-id="selectedId"
                    :width="rider.stage?.width || 800"
                    :height="rider.stage?.height || 500"
                    :audience-side="rider.stage?.audienceSide || 'bottom'"
                    @select="selectedId = $event"
                  />
                </div>
              </q-card>
              <AudioMixerPanel
                class="q-mt-md"
                :tracks="rider.audioTracks"
                :musicians="rider.musicians"
              />
            </div>
            <div class="col-12 col-lg-4">
              <q-card flat bordered class="bg-dark">
                <MusicianDetailPanel :musician="selectedMusician" />
              </q-card>
            </div>
          </div>
        </template>

        <div v-else-if="!loading" class="text-center q-pa-xl">
          <div class="text-h6">
            Rider not found
          </div>
          <p class="text-grey-6">
            This stage may be unpublished or the link is incorrect.
          </p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { publicApi } from 'src/services/public-api'
import StageCanvas from 'src/components/stage/StageCanvas.vue'
import AudioMixerPanel from 'src/components/stage/AudioMixerPanel.vue'
import MusicianDetailPanel from 'src/components/stage/MusicianDetailPanel.vue'

const route = useRoute()
const loading = ref(true)
const rider = ref(null)
const owner = ref(null)
const selectedId = ref(null)

const title = computed(() => {
  if (!rider.value) return 'Stage'
  return rider.value.bandName || rider.value.title
})

const selectedMusician = computed(() =>
  rider.value?.musicians?.find(m => m.id === selectedId.value) ?? null
)

onMounted(load)

async function load () {
  loading.value = true
  try {
    const { data } = route.params.publicId
      ? await publicApi.byPublicId(route.params.publicId)
      : await publicApi.byHandleSlug(route.params.handle, route.params.slug)
    rider.value = data.rider
    owner.value = data.owner
    selectedId.value = data.rider.musicians?.[0]?.id ?? null
  } catch {
    rider.value = null
  } finally {
    loading.value = false
  }
}
</script>
