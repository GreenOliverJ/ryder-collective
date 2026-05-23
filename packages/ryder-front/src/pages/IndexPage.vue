<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl items-center">
      <div class="col-12 col-md-6">
        <div class="text-h3 text-weight-bold q-mb-md">
          Tech riders, on stage
        </div>
        <p class="text-body1 text-grey-4 q-mb-lg">
          Build an interactive stage layout for your band — musician positions, instruments,
          technical needs, monitor mixes, and stem / full audio previews for FOH and artists.
        </p>
        <div class="row q-gutter-sm">
          <q-btn v-if="!auth.isAuthenticated" unelevated color="primary" size="lg" label="Get started" to="/register" />
          <q-btn v-else unelevated color="primary" size="lg" label="Open dashboard" to="/dashboard" />
          <q-btn outline color="primary" size="lg" label="Example stage" to="/stage/demo/demo-gig" />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-dark q-pa-md">
          <div class="text-subtitle1 q-mb-sm">
            Creator vs public view
          </div>
          <q-list dark>
            <q-item>
              <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Editor</q-item-label>
                <q-item-label caption>Drag musicians on stage, add tech notes, upload stems</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="public" color="secondary" /></q-item-section>
              <q-item-section>
                <q-item-label>Shareable URL</q-item-label>
                <q-item-label caption>Visitors tap musicians and play individual or full mixes</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth-store'
const auth = useAuthStore()
</script>
