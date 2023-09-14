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
    <div class="new-first">
      <ChatConversationModalUserMultiSelect
        :selected="selected"
        @setSelected="selected = $event"
        :options="[...userStore.users.values()].filter((user) => user.id !== userStore.me?.id)"
      />
      <GeneralInputCheckbox class="new-first-checkbox" v-model="isPrivate">
        <GeneralTooltip>
          <template #content>Once made, conversations cannot be converted between group and private. </template>
          Private Conversation
        </GeneralTooltip>
      </GeneralInputCheckbox>
    </div>
    <GeneralInputAutosize class="new-autosize" placeholder="Write a message..." label="New Message" v-model="message" />
    <div class="new-submit">
      <GeneralIconButton
        :title="displayedErrorMessage ?? 'Send Message'"
        :icon="PaperAirplaneIcon"
        color="var(--highlight)"
        size="2.5rem"
        type="submit"
        :disabled="loading || !canSend"
      />
    </div>
  </form>
</template>

<style scoped>
.new {
  padding: 2rem;
  width: 80rem;

  display: grid;
  row-gap: 4rem;

  &-first {
    display: flex;
    gap: 4rem;

    &-checkbox {
      align-self: end;
      padding-bottom: 0.6rem;
    }
  }

  &-autosize {
    padding: 0;
  }

  &-submit {
    justify-self: end;
  }

  &-error {
    color: red;
  }
}
</style>
