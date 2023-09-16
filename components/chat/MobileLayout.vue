<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'height: 100vh;',
  },
})

const mediaStore = useMediaStore()
defineProps<{ id: ConversationId }>()
</script>

<template>
  <div class="mobile-layout">
    <div class="mobile-layout-conversation-list" v-if="mediaStore.conversationListOpen === true">
      CONVERSATION LIST GOES HERE
    </div>
    <ChatMessageList :conversation-id="id" />
  </div>
</template>

<style scoped>
.mobile-layout {
  position: relative;
  height: calc(100vh - var(--header-height));

  &-conversation-list {
    position: absolute;
    z-index: var(--z-high);
    top: calc(-1 * var(--header-height));
    left: 0;
    width: 80%;
    height: 100vh;
    background: radial-gradient(circle, var(--bg-primary), var(--bg-alt3), var(--bg-alt5));
  }
}
</style>
