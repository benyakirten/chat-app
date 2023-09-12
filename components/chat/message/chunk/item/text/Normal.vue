<script setup lang="ts">
import type { ConversationMessage } from '@/stores/messages'

const { status, content } = defineProps<{ status: ConversationMessage['status']; content: string }>()
</script>

<template>
  <div class="content" :class="{ errored: status === 'error', loading: status === 'pending' }">
    <!-- TODO: Add parsing for code blocks/etc, also make sure html is escaped -->
    {{ content }}
  </div>
</template>

<style scoped>
.content {
  text-align: left;
  width: 100%;
  transition: all 250ms ease-in;
  word-break: break-all;
  white-space: pre-wrap;

  &.errored {
    text-decoration: line-through;
  }

  &.loading,
  &.errored {
    opacity: 0.7;
  }
}
</style>
