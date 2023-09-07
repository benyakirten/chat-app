<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const { showEditButton } = defineProps<{ showEditButton: boolean }>()
const emits = defineEmits<{ (e: 'edit'): void; (e: 'delete'): void }>()
</script>

<template>
  <div class="container">
    <Transition name="fade">
      <GeneralIconButton
        v-if="showEditButton"
        title="Edit Message"
        :icon="PencilIcon"
        size="0.8rem"
        @click="emits('edit')"
      />
    </Transition>
    <GeneralIconButton title="Delete Message" :icon="TrashIcon" size="0.8rem" @click.stop="emits('delete')" />
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
  color: var(--accent);
}
</style>
