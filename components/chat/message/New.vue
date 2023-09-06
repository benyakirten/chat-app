<script setup lang="ts">
import { ConversationId, useMessageStore } from '@/stores/messages';

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const messageStore = useMessageStore()
const conversation = computed(() => messageStore.conversations.get(conversationId))

function updateConversationDraft(value: string) {
  if (!conversation.value) {
    return
  }

  conversation.value.draft = value
}
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <GeneralInputAutosize
    placeholder="Write a message..."
    label="New Message"
    @submit="messageStore.sendMessage(conversationId, $event)"
    @keyup="updateConversationDraft"
    :value="conversation?.draft"
  />
</template>
