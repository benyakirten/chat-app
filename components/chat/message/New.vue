<script setup lang="ts">
const { conversationId } = defineProps<{ conversationId: ConversationId }>()

const messageStore = useMessageStore()

const conversation = computed(() => messageStore.conversation(conversationId))
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

function startTyping(e: Event) {
  if (e.target instanceof HTMLTextAreaElement && e.target.value.trim()) {
    messageStore.startTyping(conversationId)
  }
}

const canWrite = computed(() => messageStore.conversationCanChange(conversationId))
</script>

<template>
  <GeneralInputAutosize
    placeholder="Write a message..."
    label="New Message"
    @input="startTyping"
    @keydown.enter="sendMessage(conversationId, value)"
    v-model="value"
    class="new-message-autosize"
    :disabled="!canWrite"
  />
</template>

<style scoped>
.new-message-autosize {
  place-content: end;
  padding: var(--size-sm);
  padding-bottom: calc(var(--size-sm) * 0.5);
}
</style>
