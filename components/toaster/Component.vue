<script setup lang="ts">
const toastStore = useToastStore()
</script>

<template>
  <section class="toaster">
    <TransitionGroup name="toast">
      <ToasterToast v-for="[id, toast] of toastStore.toasts" :key="id" :toast="toast" />
    </TransitionGroup>
  </section>
</template>

<style scoped>
.toaster {
  z-index: var(--z-top);
  position: fixed;
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
  transition: transform 400ms ease, opacity 300ms ease-out;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0.2;
}

.toast-enter-from {
  transform: translateX(-100%);
}

.toast-leave-to {
  transform: translateX(100%);
}
</style>
