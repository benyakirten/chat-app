<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

const emits = defineEmits<{ (e: 'edit'): void, (e: 'delete'): void }>()
</script>

<template>
  <div class="container">
    <GeneralIconButton
      title="Edit Message"
      :icon="PencilIcon"
      size="0.8rem"
      @click="emits('edit')"
    />
    <GeneralIconButton
      title="Delete Message"
      :icon="TrashIcon"
      size="0.8rem"
      @click="emits('delete')"
    />
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: -0.5rem;
  right: 0.5rem;
  place-self: start;

  display: flex;
  gap: 0.35rem;
}</style>
