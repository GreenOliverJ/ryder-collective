<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="bg-dark q-pa-lg" style="width: 100%; max-width: 420px">
      <div class="text-h5 q-mb-lg">
        Log in
      </div>
      <q-form @submit.prevent="onSubmit">
        <q-input v-model="email" type="email" label="Email" filled dense class="q-mb-md" :rules="[v => !!v || 'Required']" />
        <q-input v-model="password" type="password" label="Password" filled dense class="q-mb-lg" :rules="[v => !!v || 'Required']" />
        <q-btn type="submit" unelevated color="primary" class="full-width" label="Log in" :loading="loading" />
      </q-form>
      <div class="text-center q-mt-md text-grey-5">
        No account?
        <router-link to="/register" class="text-primary">
          Sign up
        </router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit () {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push(route.query.redirect || '/dashboard')
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.error || 'Login failed' })
  } finally {
    loading.value = false
  }
}
</script>
