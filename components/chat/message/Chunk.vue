<script lang="ts" setup>
import {
  useMessageStore,
  type ConversationId,
  type ConversationMessage,
  type UserReadTimes
} from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()
const {
  chunk,
  userReadTimes,
  isPrivate,
  conversationId
} = defineProps<{ chunk: ConversationMessage[], userReadTimes: UserReadTimes, isPrivate: boolean, conversationId: ConversationId }>()

const messageStore = useMessageStore()
const userId = computed(() => chunk[0].sender)
const isMine = computed(() => userStore.isMine(chunk[0]))
const flexDirection = computed(() => isMine.value ? 'row' : 'row-reverse')
const transitionGroupName = computed(() => `message-${isMine.value ? 'mine' : 'other'}`)
</script>

<template>
  <li
    class="message-group"
    :class="{ right: isMine }"
  >
    <!-- TODO: Figure out why this transition group isn't working -->
    <ul class="messages">
      <TransitionGroup :name="transitionGroupName">
        <ChatMessageChunkItem
          v-for="(message, i) in chunk"
          @delete="messageStore.deleteMessage(conversationId, message.messageId)"
          @edit="messageStore.startMessageEdit(conversationId, message)"
          :read-times="userReadTimes"
          :message="message"
          :is-mine="isMine"
          :is-first="i === 0"
          :is-last="i === chunk.length - 1"
          :is-private="isPrivate"
          :key="message.messageId"
        />
      </TransitionGroup>
    </ul>
    <div class="avatar">
      <GeneralAvatar :user-id="userId" />
    </div>
  </li>
</template>

<style scoped>
.message-group {
  display: flex;
  gap: 1rem;
  flex-direction: v-bind(flexDirection);
  max-width: 60%;
}

.avatar {
  align-self: end;
}

.messages {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.right {
  align-self: flex-end;
}

.message-mine-move,
.message-other-move,
.message-mine-enter-active,
.message-mine-leave-active,
.message-other-enter-active,
.message-other-leave-active {
  transition: all var(--time-300) ease;
}

.message-mine-enter-from,
.message-mine-leave-to,
.message-other-enter-to,
.message-other-leave-from {
  opacity: 0.2;
}

.message-mine-enter-from,
.message-mine-leave-to {
  transform: translateX(100%);
}

.message-other-enter-to,
.message-other-leave-from {
  transform: translateX(-100%);
}
</style>
