<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineProps<{ showEditButton: boolean }>()
defineEmits<{ (e: 'edit'): void; (e: 'delete'): void }>()
</script>

<template>
  <div class="message-buttons">
    <Transition name="fade">
      <GeneralIconButton
        v-if="showEditButton"
        title="Edit Message"
        :icon="PencilIcon"
        size="1.6rem"
        @click="$emit('edit')"
      />
    </Transition>
    <GeneralIconButton title="Delete Message" :icon="TrashIcon" size="1.6rem" @click.stop="$emit('delete')" />
  </div>
</template>

<style scoped>
.message-buttons {
  position: absolute;
  top: -2rem;
  right: 0.5rem;
  place-self: start;
  opacity: 0;

  display: flex;
  gap: 0.35rem;
  color: var(--accent);
  background-color: var(--bg-alt4);
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;

  transition: opacity 200ms ease-out;

  &:hover {
    opacity: 1;
  }
}
</style>
