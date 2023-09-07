<script setup lang="ts">
import { ConversationId, useMessageStore } from '@/stores/messages';

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const messageStore = useMessageStore()
const conversation = computed(() => messageStore.conversations.get(conversationId))
const debouncer = useDebounce((val: string) => {
  if (conversation.value) {
    conversation.value.draft = val
  }
})
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <GeneralInputAutosize
    placeholder="Write a message..."
    label="New Message"
    @submit="messageStore.sendMessage(conversationId, $event)"
    @keyup="debouncer"
    :value="conversation?.draft"
  />
</template>
