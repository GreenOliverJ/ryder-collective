<template>
  <q-card flat bordered class="bg-dark musician-needs-overview">
    <q-card-section class="q-pb-sm">
      <q-toggle
        v-model="showOverview"
        dense
        label="Show full list of needs"
        color="primary"
      />
    </q-card-section>

    <q-card-section v-if="showOverview" class="q-pt-none">
      <p v-if="!musicians.length" class="text-grey-6 text-center q-ma-none">
        No musicians on this stage yet.
      </p>

      <div v-else class="musician-needs-overview__scroll">
        <table class="needs-table">
          <thead>
            <tr>
              <th class="needs-table__corner" scope="col" />
              <th
                v-for="m in musicians"
                :key="m.id"
                class="needs-table__col-head"
                scope="col"
              >
                <div
                  class="needs-table__head"
                  :style="{ '--musician-color': musicianColor(m) }"
                >
                  <div class="needs-table__head-accent" />
                  <div class="needs-table__head-body">
                    <div class="needs-table__head-name">
                      {{ m.name }}
                    </div>
                    <div v-if="m.role" class="needs-table__head-meta">
                      {{ m.role }}
                    </div>
                    <div v-if="formatInstruments(m.instrument)" class="needs-table__head-meta">
                      {{ formatInstruments(m.instrument) }}
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="needs-table__row-label" scope="row">
                Technical needs
              </th>
              <td
                v-for="m in musicians"
                :key="`${m.id}-tech`"
                class="needs-table__cell"
              >
                <ul v-if="m.technicalNeeds?.length" class="needs-table__list q-ma-none q-pl-md">
                  <li v-for="(item, i) in m.technicalNeeds" :key="i">
                    {{ item }}
                  </li>
                </ul>
                <span v-else class="text-grey-6">—</span>
              </td>
            </tr>
            <tr>
              <th class="needs-table__row-label" scope="row">
                Sound (FOH)
              </th>
              <td
                v-for="m in musicians"
                :key="`${m.id}-foh`"
                class="needs-table__cell"
              >
                <span v-if="m.soundRequirements">{{ m.soundRequirements }}</span>
                <span v-else class="text-grey-6">—</span>
              </td>
            </tr>
            <tr>
              <th class="needs-table__row-label" scope="row">
                Monitor mix
              </th>
              <td
                v-for="m in musicians"
                :key="`${m.id}-mon`"
                class="needs-table__cell"
              >
                <div v-if="m.monitorMix || m.usesInEar" class="column q-gutter-xs">
                  <span v-if="m.monitorMix">{{ m.monitorMix }}</span>
                  <q-chip
                    v-if="m.usesInEar"
                    dense
                    size="sm"
                    color="accent"
                    text-color="white"
                    class="q-ma-none self-start"
                  >
                    In-ear
                  </q-chip>
                </div>
                <span v-else class="text-grey-6">—</span>
              </td>
            </tr>
            <tr>
              <th class="needs-table__row-label" scope="row">
                Notes
              </th>
              <td
                v-for="m in musicians"
                :key="`${m.id}-notes`"
                class="needs-table__cell"
              >
                <span v-if="m.notes">{{ m.notes }}</span>
                <span v-else class="text-grey-6">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { formatInstruments } from 'src/utils/instruments'

defineProps({
  musicians: { type: Array, default: () => [] }
})

const showOverview = ref(false)

function musicianColor (m) {
  const c = m?.color
  return typeof c === 'string' && /^#[0-9A-Fa-f]{6}$/.test(c) ? c : '#7c4dff'
}
</script>
