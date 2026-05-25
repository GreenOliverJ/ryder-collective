<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h5">
          Your tech riders
        </div>
        <div class="text-grey-5">
          {{ auth.user?.displayName }} · @{{ auth.user?.handle }}
        </div>
      </div>
      <div class="col-auto">
        <q-btn unelevated color="primary" icon="add" label="New rider" :loading="creating" @click="createRider" />
      </div>
    </div>

    <q-inner-loading :showing="loading" />

    <section v-if="showcase" class="q-mb-xl">
      <div class="text-subtitle2 text-grey-5 q-mb-sm">
        Example — always available
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="bg-dark dashboard-showcase-card">
            <q-card-section>
              <div class="row items-center q-gutter-sm q-mb-xs">
                <q-chip dense color="accent" text-color="white" icon="visibility">
                  Example
                </q-chip>
                <q-chip dense outline color="positive" text-color="white">
                  Published
                </q-chip>
              </div>
              <div class="text-h6">
                {{ showcase.title }}
              </div>
              <div v-if="showcase.bandName" class="text-caption text-grey-5">
                {{ showcase.bandName }}
              </div>
              <p v-if="showcase.description" class="text-body2 text-grey-4 q-mt-sm q-mb-none">
                {{ showcase.description }}
              </p>
            </q-card-section>
            <q-separator dark />
            <q-card-actions align="right">
              <q-btn
                flat
                icon="open_in_new"
                label="View stage"
                :to="{ name: 'stage-public', params: { handle: showcase.handle, slug: showcase.slug } }"
              />
              <q-btn
                flat
                color="primary"
                icon="content_copy"
                label="Use as template"
                :loading="cloning"
                @click="cloneFromDemo"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>

    <div class="text-subtitle2 text-grey-5 q-mb-sm">
      Your riders
    </div>

    <div v-if="!loading && !riders.length" class="text-center q-pa-xl text-grey-6">
      <q-icon name="queue_music" size="64px" class="q-mb-md" />
      <div>No riders yet. Create one or copy the example above.</div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="r in riders" :key="r._id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="bg-dark">
          <q-card-section>
            <div class="text-h6">
              {{ r.title }}
            </div>
            <div v-if="r.bandName" class="text-caption text-grey-5">
              {{ r.bandName }}
            </div>
            <q-chip dense :color="r.isPublished ? 'positive' : 'grey-8'" text-color="white" class="q-mt-sm">
              {{ r.isPublished ? 'Published' : 'Draft' }}
            </q-chip>
          </q-card-section>
          <q-separator dark />
          <q-card-actions align="right">
            <q-btn flat label="Edit" :to="{ name: 'editor', params: { id: r._id } }" />
            <q-btn
              v-if="r.isPublished"
              flat
              icon="open_in_new"
              :to="{ name: 'stage-public', params: { handle: auth.user?.handle, slug: r.slug } }"
            />
            <q-btn
              flat
              color="negative"
              icon="delete"
              :loading="deletingId === r._id"
              :disable="!!deletingId"
              @click="confirmDelete(r)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { ridersApi } from 'src/services/riders-api'

const $q = useQuasar()
const auth = useAuthStore()
const router = useRouter()

const riders = ref([])
const showcase = ref(null)
const loading = ref(true)
const creating = ref(false)
const cloning = ref(false)
const deletingId = ref(null)

onMounted(load)

async function load () {
  loading.value = true
  try {
    const { data } = await ridersApi.list()
    riders.value = data.riders
    showcase.value = data.showcase
    if (auth.user?.handle === data.showcase?.handle) {
      riders.value = data.riders.filter(r => r.slug !== data.showcase.slug)
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Failed to load riders' })
  } finally {
    loading.value = false
  }
}

async function createRider () {
  creating.value = true
  try {
    const { data } = await ridersApi.create({
      title: 'Untitled gig',
      bandName: ''
    })
    router.push({ name: 'editor', params: { id: data.rider._id } })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Could not create rider' })
  } finally {
    creating.value = false
  }
}

async function cloneFromDemo () {
  cloning.value = true
  try {
    const { data } = await ridersApi.createFromDemo()
    $q.notify({ type: 'positive', message: 'Example copied — edit and publish when ready' })
    router.push({ name: 'editor', params: { id: data.rider._id } })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Could not copy example' })
  } finally {
    cloning.value = false
  }
}

function confirmDelete (rider) {
  const label = rider.bandName ? `${rider.title} (${rider.bandName})` : rider.title
  $q.dialog({
    title: 'Delete rider?',
    message: `"${label}" will be permanently removed. This cannot be undone.`,
    cancel: { label: 'Cancel', flat: true, color: 'grey-5' },
    ok: { label: 'Delete', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(() => deleteRider(rider))
}

async function deleteRider (rider) {
  deletingId.value = rider._id
  try {
    await ridersApi.remove(rider._id)
    riders.value = riders.value.filter(r => r._id !== rider._id)
    $q.notify({ type: 'positive', message: 'Rider deleted' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Could not delete rider' })
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
.dashboard-showcase-card {
  box-shadow: 0 0 0 1px rgba(124, 77, 255, 0.45);
}
</style>
