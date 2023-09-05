<script setup lang="ts">
import { ConversationId, useMessageStore } from '@/stores/messages';

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const messageStore = useMessageStore()

function handleSubmit(value: string) {
  messageStore.sendMessage(conversationId, value)
}
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <GeneralInputAutosize
    placeholder="Write a message..."
    label="New Message"
    @submit="handleSubmit"
  />
</template>
