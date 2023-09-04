<script setup lang="ts">

import { useToastStore } from '@/stores/toasts';

const toastStore = useToastStore()
</script>

<template>
  <section class="toaster">
    <TransitionGroup name="toast">
      <ToasterToast
        v-for="[id, toast] of toastStore.toasts"
        :key="id"
        :toast="toast"
      />
    </TransitionGroup>
  </section>
</template>

<style scoped>
.toaster {
  position: fixed;
  z-index: 10;
  inset-block-start: 0;
  inset-inline: 0;
  padding-block-start: 2vh;

  display: grid;
  row-gap: 0.5rem;
  justify-items: center;
  align-content: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform var(--time-400) ease;
}

.toast-enter-active {
  transform-origin: left;
}

.toast-leave-active {
  transform-origin: right;
}

.toast-leave-to,
.toast-enter-from {
  transform: scaleX(0);
}</style>
