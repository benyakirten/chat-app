<script setup lang="ts">
import type { ConversationId } from '@/stores/messages'

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const messageStore = useMessageStore()
const conversation = computed(() => messageStore.conversations.get(conversationId))
const { debouncer } = useDebounce((val: string) => {
  if (conversation.value) {
    conversation.value.draft = val
  }
})
const value = ref(conversation.value?.draft ?? '')
watch(value, (val) => debouncer(val))

function sendMessage(conversationId: string, val: string) {
  messageStore.sendMessage(conversationId, val)
  // Some reason await next tick doesn't wait for value to be replaced with \n
  requestAnimationFrame(() => (value.value = ''))
}
</script>

<template>
  <GeneralInputAutosize
    placeholder="Write a message..."
    label="New Message"
    @submit="sendMessage(conversationId, $event)"
    v-model="value"
  />
</template>
