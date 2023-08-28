<script lang="ts" setup>
import { Conversation, ConversationId, ConversationMessage, MessageId, UserId, UserReadTimes, useMessageStore } from '@/stores/messages';
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

function chunkMessagesByAuthor(messages: Map<MessageId, ConversationMessage>) {
  const messageChunks: ConversationMessage[][] = []

  let lastAuthor: UserId | null = null
  let currentChunk: ConversationMessage[] = []
  for (const message of messages.values()) {
    if (lastAuthor && lastAuthor !== message.sender) {
      messageChunks.push(currentChunk)
      currentChunk = []
    }

    lastAuthor = message.sender
    currentChunk.push(message)
  }

  // TODO: Figure out how to make sure last chunk is
  if (currentChunk.length > 0) {
    messageChunks.push(currentChunk)
  }

  return messageChunks
}

const messageChunks = computed(() => messages.value && chunkMessagesByAuthor(messages.value))
</script>

<template>
  <div class="container">
    <div class="no-conversation" v-if="!messageChunks || !conversationId">
      The conversation couldn't be found?
    </div>
    <div class="no-messages" v-else-if="messageChunks.length === 0">
      No messages in this conversation. Be the first to say something.
    </div>
    <div class="list" v-else>
      <TransitionGroup name="message-list">
        <ChatMessageChunk v-for="chunk of messageChunks" :key="chunk[0].messageId" :chunk="chunk"
          :user-read-times="userReadTimes" />
      </TransitionGroup>
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

.message-list-enter-active,
.message-list-leave-active {
  transition: opacity var(--time-150) ease, transform var(--time-200), ease-in var(--time-50);
  opacity: 1;
  transform: scaleX(1);
}

.message-list-enter-from,
.message-list-leave-to {
  opacity: 0;
  transform: scaleX(0);
}
</style>