<script setup lang="ts">
import type { ConversationMessage } from '@/stores/messages'

defineProps<{
  content: string
  status: ConversationMessage['status']
  isEditing: boolean
}>()
</script>

<template>
  <ChatMessageChunkItemTextInput v-if="isEditing" :content="content" />
  <ChatMessageChunkItemTextNormal v-else :content="content" :status="status" />
</template>
