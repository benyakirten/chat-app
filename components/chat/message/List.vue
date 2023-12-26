<script lang="ts" setup>
import { getUserReadTimes, sortMessagesByTime } from '@/utils/messages'

const route = useRoute()
const messageStore = useMessageStore()
const userStore = useUsersStore()

const props = defineProps<{ conversationId: ConversationId }>()
const list = ref<HTMLUListElement | null>(null)
const viewedMessageId = ref<MessageId | false>(typeof route.query['view'] === 'string' && route.query['view'])
const lastMessageSize = ref(0)
const conversation = computed(() => messageStore.conversation(props.conversationId))
const messages = computed(() => sortMessagesByTime(conversation.value?.messages))
const messageChunks = computed(() => messages.value && chunkMessagesByAuthor(messages.value))
const userReadTimes = computed(() => (conversation.value ? getUserReadTimes(conversation.value, userStore.me?.id) : {}))

const observer = new IntersectionObserver((entries) => {
  if (entries.length === 0 || !conversation.value || !conversation.value.nextPage || !scrolledToBottom.value) {
    return
  }

  const [top] = entries
  if (!top.isIntersecting) {
    return
  }

  messageStore.getNextMessagePage(conversation.value, conversation.value.nextPage)
})
const messageTopRef = ref<HTMLLIElement>()
const scrolledToBottom = ref(false)

const someoneIsTyping = computed(() => {
  if (!conversation.value) {
    return false
  }
  for (const [id, { state }] of conversation.value.members) {
    if (id !== userStore.me?.id && state === 'typing') {
      return true
    }
  }

  return false
})

watch(
  () => props.conversationId,
  async (newVal, oldVal) => {
    if (oldVal !== newVal) {
      scrolledToBottom.value = false
      scrollToListBottom()

      await waitFor(1_000)
      scrolledToBottom.value = true
    }
  },
  { immediate: true }
)

watchEffect(() => {
  if (messageTopRef.value && scrolledToBottom.value) {
    observer.observe(messageTopRef.value)
  } else {
    observer.disconnect()
  }
})

watchEffect(() => {
  const listEl = list.value
  if (!messages.value || !listEl) {
    return
  }

  if (listEl.scrollTop === listEl.scrollHeight - listEl.offsetHeight) {
    if (messages.value.length > lastMessageSize.value || someoneIsTyping) {
      lastMessageSize.value = messages.value.length
      scrollToListBottom()
    }
  }
})

// We could do this or we could have the last element scroll into view when it's mounted
// if there isn't already a message that's
// TODO: Consider which is better - probably theother method
async function scrollToListBottom() {
  const listEl = list.value

  await nextTick()
  if (!listEl) {
    return
  }

  listEl.scrollBy({
    top: listEl.scrollHeight,
    behavior: 'smooth',
  })
}

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
  <div class="message-chunk-list">
    <p class="messages-error" v-if="!messageChunks || !conversationId">
      The conversation couldn't be found. Please check that you are viewing a conversation that exists.
    </p>
    <p class="messages-error" v-else-if="conversation.isPrivate && !conversation.publicKey">
      Encryption must be complete before you can begin sending messages.
    </p>
    <p class="messages-error" v-else-if="messageChunks.length === 0">
      No messages in this conversation. Be the first to say something.
    </p>
    <ul id="message-list" class="list" ref="list" v-else>
      <li class="list-top" v-if="conversation.nextPage" ref="messageTopRef">
        <GeneralLoading size="3rem" />
      </li>
      <ChatMessageChunk
        v-for="chunk of messageChunks"
        :key="chunk[0].id"
        :chunk="chunk"
        :user-read-times="userReadTimes"
        :is-private="(conversation?.members.size ?? 0) > 2"
        :conversation-id="conversationId"
        :viewed-message-id="viewedMessageId"
      />
      <li v-if="someoneIsTyping">
        <GeneralTypingIndicator />
      </li>
    </ul>
    <ChatMessageNew v-if="conversationId" :conversation-id="conversationId" />
  </div>
</template>

<style scoped>
.message-chunk-list {
  --item-bg: conic-gradient(
    from 0deg at 50% 50%,
    var(--bg-primary) 0%,
    var(--bg-alt3) 15%,
    var(--base) 75%,
    var(--bg-alt3) 85%
  );
  --item-box-shadow: 0px 0px 7px 1px var(--box-shadow-color);

  display: grid;
  height: inherit;
  position: relative;

  .messages-error {
    padding: 1rem;
  }

  .list {
    display: flex;
    flex-direction: column;

    gap: 1rem;
    align-items: flex-start;
    padding: 2rem 1.5rem;
    padding-bottom: 1rem;
    overflow-x: hidden;
    overflow-y: auto;

    &-top {
      display: grid;
      place-items: center;
      padding: var(--size-md);
      width: 100%;
    }
  }
}
</style>
