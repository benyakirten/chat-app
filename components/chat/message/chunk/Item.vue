<script setup lang="ts">
import type { ConversationMessage, MessageId, UserReadTimes } from '@/stores/messages'
import { getMessageReadList } from '~/utils/messages'

const messageStore = useMessageStore()
const userStore = useUsersStore()
const props = defineProps<{
  message: ConversationMessage
  readTimes: UserReadTimes
  isMine: boolean
  isFirst: boolean
  isLast: boolean
  isPrivate: boolean
  autoView: boolean
}>()
const emit = defineEmits<{ (e: 'delete', id: MessageId): void; (e: 'edit', id: MessageId): void }>()
const MESSAGE_HIGHLIGHT_DURATION = 1600

const readList = computed(() => getMessageReadList(props.message.createTime, userStore.users, props.readTimes))
const justifyAuthor = computed(() => (props.isMine ? 'flex-end' : 'flex-start'))
const textAlign = computed(() => (props.isMine ? 'right' : 'left'))
const isEditing = computed(() => props.message.id === messageStore.editedMessage?.messageId)
const highlighted = ref(false)
const messageEl = ref<HTMLLinkElement | null>(null)

onMounted(() => {
  if (props.autoView && messageEl.value) {
    highlighted.value = true

    requestAnimationFrame(() => {
      messageEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    setTimeout(() => {
      highlighted.value = false
    }, MESSAGE_HIGHLIGHT_DURATION)
  }
})
</script>

<template>
  <li ref="messageEl" class="message" :class="{ first: isFirst, last: isLast, highlighted }">
    <ChatMessageChunkItemButtons
      @delete="emit('delete', message.id)"
      @edit="emit('edit', message.id)"
      :showEditButton="!messageStore.editedMessage"
      v-if="isMine && message.status === 'complete'"
    />
    <ChatMessageChunkItemAuthor
      v-if="isFirst"
      :justify="justifyAuthor"
      :name="userStore.users.get(message.sender)?.name"
    />
    <ChatMessageChunkItemContent :is-editing="isEditing" :content="message.content" :status="message.status" />
    <ChatMessageChunkItemStatus
      @resend="messageStore.resendMessage(message)"
      :is-mine="isMine"
      :is-private="isPrivate"
      :align="textAlign"
      :read-list="readList"
      :create-time="message.createTime"
      :update-time="message.updateTime"
      :status="message.status"
      :is-editing="isEditing"
    />
    <ChatMessageChunkItemTail v-if="isLast" :is-mine="isMine" />
  </li>
</template>

<style scoped>
.message {
  position: relative;
  display: grid;
  row-gap: 0.5rem;
  place-items: center;

  background-color: var(--bg-alt1);

  padding: 0.75rem;

  transition: transform 200ms ease, background-color 300ms ease;

  &.highlighted {
    background-color: var(--bg-alt4);
    transform: scale(1.1);
  }

  &.first {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }

  &.last {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
}
</style>
