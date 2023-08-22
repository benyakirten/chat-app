<script lang="ts" setup>
import { useMessageStore } from '@/stores/messages';

const store = useMessageStore()
const messages = computed(() => store.currentConversation?.messages)
</script>

<template>
  <div class="container">
    <div class="no-messages" v-if="!messages?.size">
      No messages in this conversation. Be the first to end one.
    </div>
    <div class="list" v-else>
      <TransitionGroup name="message-list">
        <!-- Display messages from others on right, display author written mesages on right -->
        <!-- An individual message should display author, last update time, allow users to click on their own comments -->
        <ChatMessageItem v-for="[key, value] in store.currentConversation!.messages" :key="key" :message="value" />
      </TransitionGroup>
      <!-- TODO: Add Text input that sets writing -->
    </div>
  </div>
</template>

<style scoped>
.container {
  .no-messages {
    /*  */
  }

  .list {
    /*  */
  }
}
</style>
