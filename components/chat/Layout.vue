<script setup lang="ts">
defineProps<{ id?: ConversationId }>()

const mediaStore = useMediaStore()
</script>

<template>
  <BasePage>
    <FallbackClient>
      <div class="layout-container">
        <ChatDesktopLayout v-if="mediaStore.state === 'desktop'" :id="id" />
        <ChatMobileLayout v-else :id="id" />
      </div>
    </FallbackClient>
    <ChatConversationModal />
  </BasePage>
</template>
