<script setup lang="ts">
import { PaperAirplaneIcon, PowerIcon } from '@heroicons/vue/24/solid'

const messageStore = useMessageStore()
const userStore = useUsersStore()
const toastStore = useToastStore()
const route = useRoute()

const props = defineProps<{ conversationId: ConversationId | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const conversation = computed(() => messageStore.conversations.get(props.conversationId ?? ''))
const canSend = computed(() => otherUsersSet.value.size !== 0)
const alias = ref('')
const submit = useLoading((conversation: Conversation, users: Set<string>, alias: string) =>
  messageStore.modifyConversation(conversation, users, alias)
)
const leave = useLoading((conversation: Conversation) => messageStore.leaveConversation(conversation))

const otherUsersSet = computed(() => {
  const otherUsers = new Set<string>()
  if (conversation.value) {
    const otherUsersMap = userStore.getOtherUsers(conversation.value.members)
    for (let { id } of otherUsersMap) {
      otherUsers.add(id)
    }
  }

  return otherUsers
})

const mutableOtherUsersSet = ref<Set<string>>(new Set())
watch(
  otherUsersSet,
  (val) => {
    val.forEach((id) => mutableOtherUsersSet.value.add(id))
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!conversation.value) {
    // TODO: Error handling
    return
  }

  const res = await submit.invoke(conversation.value, mutableOtherUsersSet.value, alias.value)
  emit('close')
  // TODO: Error handling
  if (res instanceof Error) {
    toastStore.add(res.message, { type: 'error' })
  }
}

async function leaveConversation() {
  if (!conversation.value) {
    // TODO: Error handling
    return
  }

  const needReroute = route.params['id'] === conversation?.value.id

  const res = await leave.invoke(conversation.value)
  emit('close')
  // TODO: Error handling
  if (res instanceof Error) {
    toastStore.add(res.message, { type: 'error' })
  }

  if (needReroute) {
    await navigateTo('/chat')
  }
}
</script>

<template>
  <div class="modify">
    <div class="modify-error" v-if="!conversation || conversation.isPrivate">
      Unable to modify the conversation. Please check that the conversation exists and is not private.
    </div>
    <form class="modify-form" v-else @submit.prevent="handleSubmit">
      <ChatConversationModalUserMultiSelect
        :options="
          [...userStore.users.values()].filter(
            (user) => user.id !== userStore.me && !conversation?.members.has(user.id)
          )
        "
        :selected="mutableOtherUsersSet"
        @setSelected="mutableOtherUsersSet = $event"
        :canDelete="false"
      />
      <label class="modify-form-submit">
        <GeneralTooltip>
          <template #content> Set a displayed name for a conversation visible to all other participants. </template>
          Alias
        </GeneralTooltip>
        <input v-model="alias" />
      </label>
      <div class="modify-form-buttons">
        <GeneralIconButton
          title="Leave conversation"
          :icon="PowerIcon"
          color="var(--highlight)"
          size="1.5rem"
          type="button"
          @click="leaveConversation"
        />
        <GeneralIconButton
          title="Send message"
          :icon="PaperAirplaneIcon"
          color="var(--highlight)"
          size="1.5rem"
          type="submit"
          :disabled="!canSend || !!submit.loading || !!leave.loading"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.modify {
  padding: 4rem;

  &-error {
    font-size: 1.8rem;
  }

  &-form {
    display: grid;
    row-gap: 4rem;

    &-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
