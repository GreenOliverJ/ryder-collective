<template>
  <q-layout view="hHh lpR lFf" class="bg-dark-page">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn flat dense round icon="music_note" to="/" aria-label="Home" />
        <q-toolbar-title class="text-weight-bold">
          Ryder
        </q-toolbar-title>
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
import { useAuthStore } from 'src/stores/auth-store'

const auth = useAuthStore()
const router = useRouter()

function onLogout () {
  auth.logout()
  router.push({ name: 'home' })
}
</script>
