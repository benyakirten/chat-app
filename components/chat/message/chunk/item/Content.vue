<script setup lang="ts">
import { ConversationMessage } from '@/stores/messages';

const { content, status } = defineProps<{ content: string, status: ConversationMessage['status'], isEditing: boolean }>()

</script>

<template>
  <ChatMessageChunkItemTextInput
    v-if="isEditing"
    :content="content"
  />
  <ChatMessageChunkItemTextNormal
    v-else
    :content="content"
    :status="status"
  />
</template>

<style scoped>
.blur-enter-active,
.blur-leave-active {
  transition: all var(--time-50) ease;
}

.blur-enter-from,
.blur-leave-to {
  opacity: 0.5;
  filter: blur(4px);
}
</style>
