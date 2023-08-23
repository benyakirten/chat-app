<script lang="ts" setup>
import { v4 as uuid } from "uuid";

import type { Conversation } from '@/stores/messages';

const PULSE_TIMEOUT = 350

const { conversation } = defineProps<{ conversation: Conversation }>()
const x = ref(0)
const y = ref(0)
const pulses = ref(new Map<string, { x: number, y: number }>())

function setCoordinates(e: Event) {
  if ("layerX" in e && "layerY" in e && typeof e.layerX === "number" && typeof e.layerY === "number") {
    x.value = e.layerX
    y.value = e.layerY
  }
}

function createPulse() {
  const pulse = uuid()
  pulses.value.set(pulse, { x: x.value.valueOf(), y: y.value.valueOf() })

  setTimeout(() => {
    pulses.value.delete(pulse)
  }, PULSE_TIMEOUT)
}
</script>

<template>
  <li>
    <button @mousemove="setCoordinates" @click="createPulse">
      <GeneralBlip v-for="[key, { x, y }] of pulses" :key="key" :x="x" :y="y" />
      CONVO
      <!-- Converation with {{ conversation.members.size }} people -->
    </button>
  </li>
</template>

<style scoped>
button {
  position: relative;

  height: 4rem;
  width: 100%;

  color: var(--bg-color-primary);
  background-color: var(--primary-text);

  &:hover {
    color: var(--bg-color-primary);
    background-color: var(--primary-text);
  }
}
</style>
