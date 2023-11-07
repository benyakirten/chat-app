<script setup lang="ts">
defineProps<{ size: string }>()
</script>

<template>
  <div class="loader">
    <div class="loader-item"></div>
    <div class="loader-item"></div>
    <div class="loader-item"></div>
  </div>
</template>

<style scoped>
.loader {
  position: relative;
  display: inline-block;

  height: v-bind(size);
  width: v-bind(size);

  &-item {
    display: block;
    position: absolute;
    width: calc(4 / 5 * v-bind(size));
    height: calc(4 / 5 * v-bind(size));
    margin: calc(1 / 10 * v-bind(size));
    border: calc(1 / 10 * v-bind(size)) solid var(--text-color);
    border-radius: var(--rounded);
    animation: rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--text-color) transparent transparent transparent;

    &:nth-child(1) {
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
    }

    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
