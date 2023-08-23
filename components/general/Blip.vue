<script lang="ts" setup>
const { x, y } = defineProps<{ x: number, y: number }>()
const left = computed(() => `${x}px`)
const top = computed(() => `${y}px`)
</script>

<template>
  <div></div>
</template>

<style scoped>
div {
  position: absolute;
  top: v-bind(top);
  left: v-bind(left);

  border-radius: 9999px;
  background-color: var(--bg-color-primary);

  height: 0.5rem;
  width: 0.5rem;
  /* transform: translate(-50%, -50%); */

  animation: expand-out 800ms ease-in;
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
    scale: 1000 1000;
    opacity: 0;
  }
}
</style>
