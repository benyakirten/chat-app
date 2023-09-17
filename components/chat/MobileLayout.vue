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
    <ChatMessageList :conversation-id="id" />
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

.conversations-enter-active,
.conversations-leave-active {
  transition: translate 400ms ease-in-out;
}

.conversations-enter-from,
.conversations-leave-to {
  translate: -100% 0;
}
</style>
