<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="bg-dark q-pa-lg" style="width: 100%; max-width: 420px">
      <div class="text-h5 q-mb-lg">
        Set a new password
      </div>

      <q-form @submit.prevent="onSubmit">
        <q-input
          v-model="password"
          type="password"
          label="New password"
          filled
          dense
          class="q-mb-md"
          :rules="[v => !!v || 'Required', v => (v?.length >= 8) || 'Min 8 characters']"
        />
        <q-input
          v-model="confirm"
          type="password"
          label="Confirm password"
          filled
          dense
          class="q-mb-lg"
          :rules="[v => v === password || 'Passwords do not match']"
        />
        <q-btn type="submit" unelevated color="primary" class="full-width" label="Reset password" :loading="loading" />
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { authApi } from 'src/services/auth-api'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const token = computed(() => String(route.query.token || ''))
const password = ref('')
const confirm = ref('')
const loading = ref(false)

async function onSubmit () {
  if (!token.value) {
    $q.notify({ type: 'negative', message: 'Missing reset token' })
    return
  }

  loading.value = true
  try {
    await authApi.resetPassword({ token: token.value, password: password.value })
    $q.notify({ type: 'positive', message: 'Password updated. You can log in now.' })
    router.push('/login')
  } catch (e) {
    const msg = e.response?.data?.error || e.message || 'Failed to reset password'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

