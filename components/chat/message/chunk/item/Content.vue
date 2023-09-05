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
