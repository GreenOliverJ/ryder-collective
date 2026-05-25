<template>
  <q-layout view="hHh lpR lFf" class="bg-dark-page">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <router-link to="/" class="main-layout__brand" aria-label="Home">
          <img src="/logo.png" alt="" class="main-layout__logo" width="36" height="36">
          <span class="text-weight-bold">Ryder</span>
        </router-link>
        <q-space />
        <template v-if="auth.isAuthenticated">
          <q-btn flat label="My riders" to="/dashboard" />
          <q-btn flat round icon="logout" @click="onLogout" />
        </template>
        <template v-else>
          <q-btn flat label="Log in" to="/login" />
          <q-btn unelevated color="primary" label="Sign up" to="/register" />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const auth = useAuthStore()
const router = useRouter()
const $q = useQuasar()

function onLogout () {
  auth.logout()
  $q.notify({ type: 'info', message: 'Logged out' })
  router.push({ name: 'home' })
}
</script>

<style scoped>
.main-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  margin-right: 8px;
}

.main-layout__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}
</style>
