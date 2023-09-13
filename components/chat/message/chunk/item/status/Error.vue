<script lang="ts" setup>
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

defineEmits<{ (e: 'resend'): void }>()
</script>

<template>
  <span class="error">
    <span>An error occurred</span>
    <GeneralIconButton :icon="ArrowPathIcon" size="0.8rem" title="Retry Sending Message" @click="$emit('resend')" />
  </span>
</template>

<style scoped>
.error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  justify-content: flex-end;
}
</style>
