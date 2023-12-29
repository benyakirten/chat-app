<script lang="ts" setup>
const userStore = useUsersStore()
const props = defineProps<{
  chunk: ConversationMessage[]
  userReadTimes: UserReadTimes
  isPrivate: boolean
  conversationId: ConversationId
  viewedMessageId: MessageId | false
  canEdit: boolean
}>()

const messageStore = useMessageStore()
const userId = computed(() => props.chunk[0].sender)
const isMine = computed(() => userStore.isMine(props.chunk[0]))
const flexDirection = computed(() => (isMine.value ? 'row' : 'row-reverse'))
const transitionGroupName = computed(() => `message-${isMine.value ? 'mine' : 'other'}`)
</script>

<template>
  <li class="message-group" :class="{ right: isMine }">
    <ul :class="{ messages: true, mine: isMine }">
      <TransitionGroup :name="transitionGroupName">
        <ChatMessageChunkItem
          v-for="(message, i) in chunk"
          @delete="messageStore.deleteMessage(conversationId, message.id)"
          @edit="messageStore.startMessageEdit(conversationId, message)"
          :read-times="userReadTimes"
          :message="message"
          :is-mine="isMine"
          :is-first="i === 0"
          :is-last="i === chunk.length - 1"
          :is-private="isPrivate"
          :key="message.id"
          :auto-view="message.id === viewedMessageId"
          :conversation-id="conversationId"
          :can-edit="canEdit"
        />
      </TransitionGroup>
    </ul>
    <div class="avatar">
      <GeneralAvatar :user-id="userId" size="2.4rem" />
    </div>
  </li>
</template>

<style scoped>
.message-group {
  display: flex;
  gap: 1.5rem;
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
  gap: 1.5rem;

  &.mine {
    gap: 2.5rem;
  }
}

.right {
  align-self: flex-end;
}

.message-mine-enter-active,
.message-other-enter-active,
.message-other-leave-active {
  transition: all 300ms ease;
}

/* Find a better solution */
.message-mine-leave-active {
  transition: none;
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
