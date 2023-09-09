<script setup lang="ts">
import { ConversationMessage, MessageId, UserReadTimes, useMessageStore } from '@/stores/messages'
import { useUsersStore } from '@/stores/users'

const messageStore = useMessageStore()
const userStore = useUsersStore()
const { message, isMine, readTimes, isFirst, isLast, isPrivate } = defineProps<{
  message: ConversationMessage
  readTimes: UserReadTimes
  isMine: boolean
  isFirst: boolean
  isLast: boolean
  isPrivate: boolean
}>()
const emit = defineEmits<{ (e: 'delete', id: MessageId): void; (e: 'edit', id: MessageId): void }>()

const readList = computed(() => {
  const readUsers: string[] = []

  // TODO: Flatten this
  for (const id in readTimes) {
    const readTime = readTimes[id]
    if (readTime.valueOf() > message.createTime.valueOf()) {
      const user = userStore.users.get(id)
      if (user) {
        readUsers.push(user.name)
      }
    }
  }

  return readUsers
})

const justifyAuthor = computed(() => (isMine ? 'flex-end' : 'flex-start'))
const textAlign = computed(() => (isMine ? 'right' : 'left'))
const isEditing = computed(() => message.id === messageStore.editedMessage?.messageId)
</script>

<template>
  <li class="message" :class="{ first: isFirst, last: isLast }">
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

  background-color: var(--bg-color-alt1);

  padding: 0.75rem;

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
