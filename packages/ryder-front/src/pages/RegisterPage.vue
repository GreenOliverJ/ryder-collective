<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="bg-dark q-pa-lg" style="width: 100%; max-width: 420px">
      <div class="text-h5 q-mb-lg">
        Create account
      </div>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="displayName" label="Display name" filled dense class="q-mb-md" :rules="[v => !!v || 'Required']" />
        <q-input
          v-model="handle"
          label="Public handle (URL)"
          hint="your-handle → /stage/your-handle/gig-slug"
          filled
          dense
          class="q-mb-md"
          :rules="[v => /^[a-z0-9-]+$/.test(v) || 'Lowercase letters, numbers, hyphens']"
        />
        <q-input v-model="email" type="email" label="Email" filled dense class="q-mb-md" :rules="[v => !!v || 'Required']" />
        <q-input v-model="password" type="password" label="Password (8+ chars)" filled dense class="q-mb-lg" :rules="[v => (v && v.length >= 8) || 'Min 8 characters']" />
        <q-btn type="submit" unelevated color="primary" class="full-width" label="Sign up" :loading="loading" />
      </q-form>
      <div class="text-center q-mt-md text-grey-5">
        Already have an account?
        <router-link to="/login" class="text-primary">
          Log in
        </router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const auth = useAuthStore()
const router = useRouter()

const displayName = ref('')
const handle = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

watch(displayName, name => {
  if (!handle.value && name) {
    handle.value = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32)
  }
})

async function onSubmit () {
  loading.value = true
  try {
    await auth.register({
      displayName: displayName.value,
      handle: handle.value,
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Registration failed' })
  } finally {
    loading.value = false
  }
}
</script>
