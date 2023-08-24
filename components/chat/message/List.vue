<script lang="ts" setup>
import { ConversationId, useMessageStore } from '@/stores/messages';

const store = useMessageStore()
const { conversationId } = defineProps<{ conversationId: ConversationId | null }>()
const messages = computed(() => store.conversation(conversationId)?.messages)
</script>

<template>
  <div class="container">
    <div class="no-conversation" v-if="!messages">
      The conversation couldn't be found?
    </div>
    <div class="no-messages" v-else-if="messages.length === 0">
      No messages in this conversation. Be t
    </div>
    <div class="list" v-else>
      <TransitionGroup name="message-list">
        <!-- Display messages from others on right, display author written mesages on right -->
        <!-- An individual message should display author, last update time, allow users to click on their own comments -->
        <ChatMessageItem v-for="message in messages" :key="message.messageId" :message="message" />
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
