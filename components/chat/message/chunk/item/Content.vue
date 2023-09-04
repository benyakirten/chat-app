<script setup lang="ts">
import { ConversationMessage } from '@/stores/messages';

const { content, status, isEditing } = defineProps<{ content: string, status: ConversationMessage['status'], isEditing: boolean }>()
</script>

<template>
  <div v-if="isEditing">
    <!-- TODO -->
  </div>
  <div v-else class="content" :class="{ errored: status === 'error', loading: status === 'pending' }">
    <!-- TODO: Add parsing for code blocks/etc -->
    {{ content }}
  </div>
</template>

<style scoped>
.content {
  text-align: left;
  width: 100%;
  transition: all var(--time-250) ease-in;

  &.errored {
    text-decoration: line-through;
  }

  &.loading,
  &.errored {
    opacity: 0.7;
  }
}
</style>
