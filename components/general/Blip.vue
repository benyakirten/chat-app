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
  transform: translate(-30%, -30%);

  animation: expand-out var(--time-400) ease-out;
}

@keyframes expand-out {
  from: {
    scale: 1;
    opacity: 0.6;
  }

  to {
    scale: 3;
    opacity: 0;
  }
}
</style>
