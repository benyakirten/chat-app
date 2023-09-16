<script setup lang="ts">
defineProps<{ id: ConversationId }>()

const mediaStore = useMediaStore()
</script>

<template>
  <ChatDesktopLayout v-if="mediaStore.state === 'desktop'" :id="id" />
  <ChatMobileLayout v-else :id="id" />
</template>
