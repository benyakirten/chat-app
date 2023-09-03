<script setup lang="ts">
import { useToastStore } from '@/stores/toasts';

const toastStore = useToastStore()
</script>

<template>
  <section class="toaster">
    <output role="status" class="toaster-toast" v-for="[id, toast] of toastStore.toasts" :key="id">
      {{ toast.content }}
    </output>
  </section>
</template>

<style scoped>
.toaster {
  position: fixed;
  z-index: 10;
  inset-block-end: 0;
  inset-inline: 0;
  padding-block-end: 5vh;

  display: grid;
  row-gap: 0.5rem;

  &-toast {
    /*  */
  }
}
</style>
