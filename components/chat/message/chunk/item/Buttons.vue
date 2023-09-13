<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineProps<{ showEditButton: boolean }>()
defineEmits<{ (e: 'edit'): void; (e: 'delete'): void }>()
</script>

<template>
  <div class="container">
    <Transition name="fade">
      <GeneralIconButton
        v-if="showEditButton"
        title="Edit Message"
        :icon="PencilIcon"
        size="0.8rem"
        @click="$emit('edit')"
      />
    </Transition>
    <GeneralIconButton title="Delete Message" :icon="TrashIcon" size="0.8rem" @click.stop="$emit('delete')" />
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: -0.7rem;
  right: 0.5rem;
  place-self: start;
  opacity: 0;

  display: flex;
  gap: 0.35rem;
  color: var(--accent);
  background-color: var(--base);
  /* The icons are adding an extra 4px of padding - I'm not sure why */
  padding: 0.2rem 0.25rem 0.5rem 0.25rem;
  border-radius: 4px;

  transition: opacity 300ms cubic-bezier(0.55, 0.085, 0.68, 0.53);

  &:hover {
    opacity: 1;
  }
}
</style>
