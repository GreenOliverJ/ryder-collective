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

    <div v-if="!loading && !riders.length" class="text-center q-pa-xl text-grey-6">
      <q-icon name="queue_music" size="64px" class="q-mb-md" />
      <div>No riders yet. Create your first stage layout.</div>
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
              :to="{ name: 'stage-public', params: { handle: auth.user.handle, slug: r.slug } }"
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
const loading = ref(true)
const creating = ref(false)

onMounted(load)

async function load () {
  loading.value = true
  try {
    const { data } = await ridersApi.list()
    riders.value = data.riders
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
</script>
