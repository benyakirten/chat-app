<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'height: 100vh;',
  },
})
defineProps<{ id: ConversationId }>()

const mediaStore = useMediaStore()
</script>

<template>
  <ChatDesktopLayout v-if="mediaStore.state === 'desktop'" :id="id" />
  <ChatMobileLayout v-else :id="id" />
</template>
