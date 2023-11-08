<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/solid'

const { toast } = defineProps<{ toast: Toast }>()

const toastStore = useToastStore()
</script>

<template>
  <output role="status" class="toast" :class="toast.type">
    <span class="toast-content">
      {{ toast.content }}
    </span>
    <GeneralIconButton
      size="1.4rem"
      title="Close"
      :disabled="!toast.closeable"
      @click="toastStore.dismiss(toast.id)"
      :icon="XCircleIcon"
      color="var(--black)"
      hover-color="var(--white)"
    />
  </output>
</template>

<style scoped>
.toast {
  font-size: var(--text-size-xl);
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  width: 80%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  color: var(--black);

  &-content {
    flex: 1;
  }

  /* TODO: Use good colors/styles */
  &.success {
    background-color: var(--success-bg);
  }

  &.warning {
    background-color: var(--warning-bg);
  }

  &.error {
    background-color: var(--error-bg);
  }

  &.info {
    background-color: var(--info-bg);
  }
}
</style>
