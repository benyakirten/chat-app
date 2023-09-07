<script lang="ts" setup>
const { x, y } = defineProps<{ x: number; y: number }>()
const left = computed(() => `${x}px`)
const top = computed(() => `${y}px`)
</script>

<template>
  <div></div>
</template>

<style scoped>
div {
  pointer-events: none;

  position: absolute;
  top: v-bind(top);
  left: v-bind(left);

  border-radius: 9999px;
  background-color: var(--primary-text);
  opacity: 0;

  height: 0.5rem;
  width: 0.5rem;

  /* TODO: Make timing function */
  animation: expand-out var(--time-400) ease-in;
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
