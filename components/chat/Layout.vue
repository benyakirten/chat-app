<script setup lang="ts">
withDefaults(defineProps<{ id?: ConversationId }>(), { id: '' })

const mediaStore = useMediaStore()
</script>

<template>
  <BasePage>
    <ChatDesktopLayout v-if="mediaStore.state === 'desktop'" :id="id" />
    <ChatMobileLayout v-else :id="id" />
    <ChatConversationModal />
  </BasePage>
</template>
