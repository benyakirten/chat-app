<script lang="ts" setup>
import { Conversation, ConversationId, ConversationMessage, MessageId, UserId, UserReadTimes, useMessageStore } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const messageStore = useMessageStore()
const userStore = useUsersStore()

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const list = ref<HTMLUListElement | null>(null)
const lastMessageSize = ref(0)
const conversation = computed(() => messageStore.conversations.get(conversationId))
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

watchEffect(() => {
  if (!messages.value) {
    return
  }

  if (messages.value.size > lastMessageSize.value) {
    lastMessageSize.value = messages.value.size
    scrollToListBottom()
  }
})

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

async function scrollToListBottom() {
  await nextTick()
  if (!list.value) {
    return
  }
  list.value.scrollBy({
    top: list.value.scrollHeight, behavior: 'smooth'
  })
}

onMounted(() => {
  scrollToListBottom()
})

onUnmounted(() => {
  messageStore.stopMessageEdit()
})

const messageChunks = computed(() => messages.value && chunkMessagesByAuthor(messages.value))
</script>

<template>
  <div class="container">
    <p
      class="no-conversation"
      v-if="!messageChunks || !conversationId"
    >
      The conversation couldn't be found. Please check that you are viewing a conversation that exists.
    </p>
    <p
      class="no-messages"
      v-else-if="messageChunks.length === 0"
    >
      No messages in this conversation. Be the first to say something.
    </p>
    <ul
      class="list"
      ref="list"
      v-else
    >
      <ChatMessageChunk
        v-for="chunk of messageChunks"
        :key="chunk[0].messageId"
        :chunk="chunk"
        :user-read-times="userReadTimes"
        :is-private="(conversation?.members.size ?? 0) > 2"
        :conversation-id="conversationId"
      />
    </ul>
    <ChatMessageNew
      v-if="conversationId"
      :conversation-id="conversationId"
    />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  padding: 1rem 0;
  height: inherit;
  position: relative;

  .no-conversation,
  .no-messages {
    padding: 1rem;
  }

  .list {
    display: flex;
    flex-direction: column;

    gap: 1rem;
    align-items: flex-start;
    padding: 0.5rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
