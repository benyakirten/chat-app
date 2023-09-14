<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits<{ (e: 'close'): void }>()
const { loading, invoke } = useLoading((isPrivate: boolean, selected: Set<string>, message: string) => {
  if (isPrivate) {
    const otherUser = getFirstSetItem(selected)
    if (!otherUser) {
      throw new Error('A conversation must involve one other person.')
    }
    return messageStore.startPrivateConversation(otherUser, message)
  }
  return messageStore.startGroupConversation(selected, message)
})

const messageStore = useMessageStore()
const userStore = useUsersStore()

const selected = ref<Set<string>>(new Set())
const message = ref('')
const isPrivate = ref(true)
const errorMessage = ref<string | null>(null)
const canSend = computed(
  () => message.value !== '' && (isPrivate.value ? selected.value.size === 1 : selected.value.size >= 1)
)

// TODO: Replace this with form validation + checking if inputs are touched
const displayedErrorMessage = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }

  if (message.value === '') {
    return 'Messages must not be empty.'
  }

  if (selected.value.size === 0) {
    return 'There must be at least one conversant'
  }

  if (isPrivate.value && selected.value.size > 1) {
    return 'A private conversation can only have one other conversant'
  }

  return null
})

async function handleSubmit() {
  errorMessage.value = null
  const res = await invoke(isPrivate.value, selected.value, message.value)
  if (typeof res === 'string') {
    emit('close')
    navigateTo(`/chat/${res}`)
    return
  }

  errorMessage.value = res.message
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="new">
    <!-- TODO: Make this into a generalizable component -->
    <ChatConversationModalUserMultiSelect
      :selected="selected"
      @setSelected="selected = $event"
      :options="[...userStore.users.values()].filter((user) => user.id !== userStore.me?.id)"
    />
    <GeneralInputCheckbox v-model="isPrivate">
      <GeneralTooltip>
        <template #content>Once made, conversations cannot be converted between group and private. </template>
        Private Conversation
      </GeneralTooltip>
    </GeneralInputCheckbox>
    <GeneralInputAutosize placeholder="Write a message..." label="New Message" v-model="message" />
    <div class="new-submit">
      <GeneralIconButton
        title="Send message"
        :icon="PaperAirplaneIcon"
        color="var(--highlight)"
        size="1.5rem"
        type="submit"
        :disabled="loading || !canSend"
      />
    </div>
    <!-- If we use a tooltip, it has to be big and obnoxious -->
    <div class="new-error" v-if="displayedErrorMessage">
      {{ displayedErrorMessage }}
    </div>
  </form>
</template>

<style scoped>
.new {
  padding: 2rem;
  width: 50vw;

  display: grid;
  row-gap: 4rem;

  &-submit {
    justify-self: end;
  }

  &-error {
    color: red;
  }
}
</style>
