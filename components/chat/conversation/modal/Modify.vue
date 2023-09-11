<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

const messageStore = useMessageStore()
const userStore = useUsersStore()
const toastStore = useToastStore()

const props = defineProps<{ conversationId: ConversationId | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const conversation = computed(() => messageStore.conversations.get(props.conversationId ?? ''))
const canSend = computed(() => otherUsersSet.value.size === 0)
const alias = ref('')
const { loading, invoke } = useLoading((conversation: Conversation, users: Set<string>, alias: string) =>
  messageStore.modifyConversation(conversation, users, alias)
)

const otherUsersSet = computed(() => {
  const otherUsers = new Set<string>()
  if (conversation.value) {
    const otherUsersMap = userStore.getOtherUsers(conversation.value.members)
    for (const id in otherUsersMap.keys()) {
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
  const res = await invoke(conversation.value, mutableOtherUsersSet.value, alias.value)
  emit('close')
  // TODO: Error handling
  if (res instanceof Error) {
    toastStore.add(res.message, { type: 'error' })
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
        :selected="mutableOtherUsersSet"
        @setSelected="mutableOtherUsersSet = $event"
      />
      <label class="modify-form-submit">
        <GeneralTooltip>
          <template #content> Set a displayed name for a conversation visible to all other participants. </template>
          Alias
        </GeneralTooltip>
        <input v-model="alias" />
      </label>
      <div class="modify-form-submit">
        <GeneralIconButton
          title="Send message"
          :icon="PaperAirplaneIcon"
          color="var(--highlight)"
          size="1.5rem"
          type="submit"
          :disabled="!canSend || loading"
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
  }

  &-submit {
    justify-self: end;
  }
}
</style>
