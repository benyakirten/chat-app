<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'height: 100vh; overflow: hidden;',
  },
})
defineProps<{ id: ConversationId }>()
</script>

<template>
  <BasePage>
    <div class="messages">
      <ChatConversationList />
      <ChatMessageList :conversation-id="id" />
    </div>
  </BasePage>
</template>

<style scoped>
.messages {
  display: grid;
  grid-template-columns: 16rem 1fr;
  height: calc(100vh - var(--header-height));
}
</style>
