<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'height: 100vh; overflow: hidden;',
  },
})
defineProps<{ id?: ConversationId }>()
</script>

<template>
  <div class="messages">
    <ChatConversationList />
    <ChatMessageList v-if="id" :conversation-id="id" />
    <p v-else class="no-conversation">Select a conversation to see messages.</p>
  </div>
</template>

<style scoped>
.messages {
  display: grid;
  grid-template-columns: 16rem 1fr;
  height: calc(100vh - var(--header-height));
}

.no-conversation {
  font-size: var(--text-xl);
  padding: 1rem;
}
</style>
