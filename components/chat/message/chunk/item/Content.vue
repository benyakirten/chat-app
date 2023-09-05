<script setup lang="ts">
import { ConversationMessage } from '@/stores/messages';

const { content, status } = defineProps<{ content: string, status: ConversationMessage['status'], isEditing: boolean }>()

const ChatMessageChunkItemTextNormal = resolveComponent('ChatMessageChunkItemTextNormal')
const ChatMessageChunkItemTextInput = resolveComponent('ChatMessageChunkItemTextInput')
</script>

<template>
  <Transition
    name="blur"
    mode="out-in"
  >
    <component
      v-if="isEditing"
      :is="ChatMessageChunkItemTextInput"
      :content="content"
    />
    <component
      v-else
      :is="ChatMessageChunkItemTextNormal"
      :content="content"
      :status="status"
    />
  </Transition>
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
