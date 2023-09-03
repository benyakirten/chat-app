<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/solid';

import { useToastStore } from '@/stores/toasts';

const toastStore = useToastStore()
</script>

<template>
  <section class="toaster">
    <output role="status" class="toaster-toast" v-for="[id, toast] of toastStore.toasts" :key="id" :class="toast.type">
      <span class="toaster-toast-content">
        {{ toast.content }}
      </span>
      <GeneralIconButton size="1.4rem" title="Close" :disabled="!toast.closeable" @click="toastStore.dismiss(id)">
        <!-- TODO: Make this better/used by the component -->
        <XCircleIcon :style="{ color: toast.closeable ? 'white' : 'gray' }" />
      </GeneralIconButton>
    </output>
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

  &-toast {
    width: 80%;
    font-size: 1.4rem;
    padding: 1rem 1.5rem;
    border-radius: 2rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    &-content {
      flex: 1;
    }

    /* TODO: Use good colors */
    &.success {
      background-color: green;
    }

    &.warning {
      background-color: orange;
    }

    &.error {
      background-color: red;
    }

    &.info {
      background-color: blue;
    }
  }
}
</style>
