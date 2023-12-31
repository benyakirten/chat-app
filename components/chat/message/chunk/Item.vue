<script setup lang="ts">
const messageStore = useMessageStore()
const userStore = useUsersStore()
const props = defineProps<{
  conversationId: ConversationId
  message: ConversationMessage
  readTimes: UserReadTimes
  isMine: boolean
  isFirst: boolean
  isLast: boolean
  isPrivate: boolean
  autoView: boolean
  canEdit: boolean
}>()
const emit = defineEmits<{ (e: 'delete', id: MessageId): void; (e: 'edit', id: MessageId): void }>()
const MESSAGE_HIGHLIGHT_DURATION = 1600
const MIN_OFFSET_HEIGHT_FOR_TOOLTIP_BOTTOM = 200

const readList = computed(() => getMessageReadList(props.message.createTime, userStore.users, props.readTimes))
const justifyAuthor = computed(() => (props.isMine ? 'flex-end' : 'flex-start'))
const textAlign = computed(() => (props.isMine ? 'right' : 'left'))
const isEditing = computed(() => props.message.id === messageStore.editedMessage?.messageId)
const highlighted = ref(false)
const messageEl = ref<HTMLLinkElement | null>(null)

const tooltipDirection = ref<'bottom' | 'top'>('top')

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

useAddMountedEventCallback(
  'scroll',
  () => {
    if (!messageEl.value) {
      return
    }

    tooltipDirection.value = messageEl.value.offsetTop <= MIN_OFFSET_HEIGHT_FOR_TOOLTIP_BOTTOM ? 'bottom' : 'top'
  },
  () => document.querySelector('#message-list')
)

const border = computed(() => (highlighted.value ? '1px solid var(--highlight)' : 'none'))
</script>

<template>
  <li ref="messageEl" class="message" :class="{ first: isFirst, last: isLast, highlighted }">
    <ChatMessageChunkItemButtons
      @delete="emit('delete', message.id)"
      @edit="emit('edit', message.id)"
      :show-edit-button="!messageStore.editedMessage"
      :tooltip-direction="tooltipDirection"
      :can-edit="canEdit"
      v-if="isMine && message.status === 'complete'"
    />
    <ChatMessageChunkItemAuthor
      v-if="isFirst"
      :justify="justifyAuthor"
      :name="userStore.users.get(message.sender)?.name"
    />
    <ChatMessageChunkItemContent :is-editing="isEditing" :content="message.content" :status="message.status" />
    <ChatMessageChunkItemStatus
      @resend="messageStore.resendMessage(conversationId, message)"
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

  background-image: var(--item-bg);
  box-shadow: var(--item-box-shadow);
  border: v-bind(border);

  padding: 0.75rem;

  transition: transform 200ms ease, background-color 300ms ease, border 100ms ease;

  &.highlighted {
    background-color: var(--bg-alt5);
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
