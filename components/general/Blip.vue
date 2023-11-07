<script lang="ts" setup>
const { x, y } = defineProps<{ x: number; y: number }>()
const left = computed(() => `${x}px`)
const top = computed(() => `${y}px`)
</script>

<template>
  <div class="blip"></div>
</template>

<style scoped>
.blip {
  pointer-events: none;

  position: absolute;
  top: v-bind(top);
  left: v-bind(left);

  border-radius: var(--rounded);
  background-color: var(--text-color);
  opacity: 0;

  height: 0.5rem;
  width: 0.5rem;

  /* TODO: Make timing function */
  animation: expand-out 400ms ease-in;
}

@keyframes expand-out {
  0% {
    scale: 1;
    opacity: 0.15;
  }

  30% {
    scale: 20;
    opacity: 0.08;
  }

  90% {
    scale: 1000;
    opacity: 0;
  }
}
</style>
