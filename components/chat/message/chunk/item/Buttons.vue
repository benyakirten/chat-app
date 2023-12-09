<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{ showEditButton: boolean; tooltipDirection: 'top' | 'bottom' }>()
defineEmits<{ (e: 'edit'): void; (e: 'delete'): void }>()

const buttonsContainer = ref<HTMLDivElement | null>(null)
watchEffect(() => console.log(props.tooltipDirection))
</script>

<template>
  <div ref="buttonsContainer" class="message-buttons">
    <GeneralIconButton
      v-if="showEditButton"
      title="Edit Message"
      :icon="PencilIcon"
      :tooltip-direction="tooltipDirection"
      size="1.6rem"
      @click="$emit('edit')"
    />
    <GeneralIconButton title="Delete Message" :icon="TrashIcon" size="1.6rem" @click.stop="$emit('delete')" />
  </div>
</template>

<style scoped>
.message-buttons {
  position: absolute;
  top: -2rem;
  right: 0.5rem;
  place-self: start;

  display: flex;
  gap: 0.75rem;
  color: var(--accent);
  background-color: var(--bg-alt4);
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
}
</style>
