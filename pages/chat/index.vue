<script setup lang="ts">
definePageMeta({
  pageTransition: false,
})
</script>

<template>
  <ChatLayout><p class="no-conversation">Select a conversation to see messages.</p> </ChatLayout>
</template>

<style scoped>
.no-conversation {
  padding: 1rem;
}
</style>
