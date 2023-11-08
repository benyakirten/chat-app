<script setup lang="ts">
useHead({
  bodyAttrs: {
    style: 'height: 100vh;',
  },
})

defineProps<{ id?: ConversationId }>()

const mediaStore = useMediaStore()

useAddMountedEventCallback('keydown', (e: KeyboardEvent) => {
  if (!isTextInputFocused() && e.key === 'Escape') {
    mediaStore.conversationListOpen = false
  }
})
</script>

<template>
  <div class="mobile-layout">
    <Transition name="conversations">
      <div
        class="mobile-layout-conversation"
        v-if="mediaStore.conversationListOpen === true"
        @click="mediaStore.conversationListOpen = false"
      >
        <div class="mobile-layout-conversation-list">
          <ChatConversationList />
        </div>
      </div>
    </Transition>
    <ChatMessageList v-if="id" :conversation-id="id" />
    <p v-else class="no-conversation">Open the chat sidebar from above and select a conversation to begin</p>
  </div>
</template>

<style scoped>
.mobile-layout {
  position: relative;
  height: calc(100vh - var(--header-height));

  &-conversation {
    position: absolute;
    z-index: var(--z-raised);
    top: calc(-1 * var(--header-height));
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    backdrop-filter: blur(4px);

    &-list {
      position: absolute;
      z-index: var(--z-high);
      top: var(--header-height);
      left: 0;
      width: 80%;
      height: calc(100vh - var(--header-height));
      background: radial-gradient(circle, var(--bg-primary), var(--bg-alt3), var(--bg-alt5));
    }
  }
}

.no-conversation {
  font-size: var(--text-size-xl);
  padding: 1rem;
}

.conversations-enter-active,
.conversations-leave-active {
  transition: translate 400ms ease-in-out;
}

.conversations-enter-from,
.conversations-leave-to {
  translate: -100% 0;
}
</style>
