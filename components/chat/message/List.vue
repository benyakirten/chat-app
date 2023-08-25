<script lang="ts" setup>
import { Conversation, ConversationId, UserId, UserReadTimes, useMessageStore } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const messageStore = useMessageStore()
const userStore = useUsersStore()

const { conversationId } = defineProps<{ conversationId: ConversationId | null }>()
const conversation = computed(() => messageStore.conversations.get(conversationId ?? ""))
const messages = computed(() => conversation.value?.messages)
const userReadTimes = computed(() => conversation.value ? getUserReadTimes(conversation.value) : {})
function getUserReadTimes(conversation: Conversation): UserReadTimes {
  const readMap: Record<UserId, Date> = {}
  for (const [userId, conversationState] of conversation.members) {
    if (userId === userStore.me) {
      continue
    }
    readMap[userId] = conversationState.lastRead
  }
  return readMap
}
</script>

<template>
  <div class="container">
    <div class="no-conversation" v-if="!messages || !conversationId">
      The conversation couldn't be found?
    </div>
    <div class="no-messages" v-else-if="messages.size === 0">
      No messages in this conversation. Be the first to say something.
    </div>
    <div class="list" v-else>
      <TransitionGroup name="message-list">
        <!-- Display messages from others on right, display author written mesages on right -->
        <!-- An individual message should display author, last update time, allow users to click on their own comments -->
        <ChatMessageItem v-for="[key, message] in messages" :key="key" :message="message"
          :user-read-times="userReadTimes" />
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
    display: flex;
    flex-direction: column;

    gap: 1rem;
    align-items: flex-start;
    padding: 0.5rem;
  }
}
</style>
