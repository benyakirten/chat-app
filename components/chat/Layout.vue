<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'max-height: 100vh; overflow: hidden;',
  },
})
</script>

<template>
  <BasePage>
    <div class="messages">
      <ChatConversationList />
      <slot></slot>
    </div>
  </BasePage>
</template>

<style scoped>
.messages {
  display: grid;
  grid-template-columns: 16rem 1fr;
  height: 100vh;
  margin-right: 2rem;
}
</style>
