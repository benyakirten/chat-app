<script setup lang="ts">
import { Toast, useToastStore } from '@/stores/toasts';
import { XCircleIcon } from '@heroicons/vue/24/solid';

const { toast } = defineProps<{ toast: Toast }>()

const toastStore = useToastStore()
</script>

<template>
  <output role="status" class="toast" :class="toast.type">
    <span class="toast-content">
      {{ toast.content }}
    </span>
    <GeneralIconButton size="1.4rem" title="Close" :disabled="!toast.closeable" @click="toastStore.dismiss(toast.id)"
      :icon="XCircleIcon" />
  </output>
</template>

<style scoped>
.toast {
  font-size: 1.4rem;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  width: 80%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &-content {
    flex: 1;
  }

  /* TODO: Use good colors/styles */
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
</style>
