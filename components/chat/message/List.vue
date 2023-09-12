<script lang="ts" setup>
import { getUserReadTimes } from '@/utils/messages'

const route = useRoute()
const messageStore = useMessageStore()
const userStore = useUsersStore()

const props = defineProps<{ conversationId: ConversationId }>()
const list = ref<HTMLUListElement | null>(null)
const viewedMessageId = ref<MessageId | false>(typeof route.query['view'] === 'string' && route.query['view'])
const lastMessageSize = ref(0)
const conversation = computed(() => messageStore.conversations.get(props.conversationId))
const messages = computed(() => conversation.value?.messages)
const messageChunks = computed(() => messages.value && chunkMessagesByAuthor(messages.value))
const userReadTimes = computed(() => (conversation.value ? getUserReadTimes(conversation.value, userStore.me?.id) : {}))

watchEffect(() => {
  if (!messages.value) {
    return
  }

  if (messages.value.size > lastMessageSize.value) {
    lastMessageSize.value = messages.value.size
    // TODO: Add a way to scroll to an individual message
    scrollToListBottom()
  }
})

async function scrollToListBottom() {
  await nextTick()
  if (!list.value) {
    return
  }

  list.value.scrollBy({
    top: list.value.scrollHeight,
    behavior: 'smooth',
  })
}

// TODO: Add the ability to scroll to a particular message - may require completely different approach
onMounted(() => {
  if (typeof route.query['view'] !== 'string') {
    scrollToListBottom()
  }
})

onUnmounted(() => {
  messageStore.stopMessageEdit()
})
</script>

<template>
  <div class="container">
    <p class="no-conversation" v-if="!messageChunks || !conversationId">
      The conversation couldn't be found. Please check that you are viewing a conversation that exists.
    </p>
    <p class="no-messages" v-else-if="messageChunks.length === 0">
      No messages in this conversation. Be the first to say something.
    </p>
    <ul class="list" ref="list" v-else>
      <ChatMessageChunk
        v-for="chunk of messageChunks"
        :key="chunk[0].id"
        :chunk="chunk"
        :user-read-times="userReadTimes"
        :is-private="(conversation?.members.size ?? 0) > 2"
        :conversation-id="conversationId"
        :viewed-message-id="viewedMessageId"
      />
    </ul>
    <ChatMessageNew v-if="conversationId" :conversation-id="conversationId" />
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
