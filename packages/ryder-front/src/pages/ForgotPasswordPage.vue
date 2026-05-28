<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="bg-dark q-pa-lg" style="width: 100%; max-width: 420px">
      <div class="text-h5 q-mb-lg">
        Recover password
      </div>

      <q-form @submit.prevent="onSubmit">
        <q-input
          v-model="email"
          type="email"
          label="Email"
          filled
          dense
          class="q-mb-lg"
          :rules="[v => !!v || 'Required']"
        />
        <q-btn type="submit" unelevated color="primary" class="full-width" label="Send reset link" :loading="loading" />
      </q-form>

      <div class="text-center q-mt-md">
        <router-link to="/login" class="text-primary">
          Back to login
        </router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { authApi } from 'src/services/auth-api'

const $q = useQuasar()

const email = ref('')
const loading = ref(false)

async function onSubmit () {
  loading.value = true
  try {
    await authApi.forgotPassword({ email: email.value })
    $q.notify({ type: 'positive', message: 'If that email exists, a reset link has been sent.' })
  } catch (e) {
    const msg = e.response?.data?.error || e.message || 'Failed to request password reset'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

