<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

import type { User } from '@/stores/users'

const { open } = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const { loading, invoke } = useLoading((isPrivate: boolean, selected: Set<string>, message: string) =>
  messageStore.startConversation(isPrivate, selected, message)
)

const userStore = useUsersStore()
const messageStore = useMessageStore()
const selected = ref<Set<string>>(new Set())
const message = ref('')
const isPrivate = ref(true)
const errorMessage = ref<string | null>(null)

// TODO: Create composable for form validation/errors
watch([message, isPrivate, selected], ([message, isPrivate, selected]) => {
  console.log('FIRED', message, isPrivate, selected)
  if (message === '') {
    errorMessage.value = 'New messages must not be empty.'
    return
  }

  if (isPrivate && selected.size !== 1) {
    errorMessage.value = 'Private conversations can only have one other participant.'
    return
  }

  if (!isPrivate && selected.size < 1) {
    errorMessage.value = 'Conversations must have at least one other participant.'
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

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
</script>

<template>
  <BaseModal @close="emit('close')" :open="open">
    <form @submit.prevent="handleSubmit" class="new">
      <BaseMultiSelect
        :options="[...userStore.users.values()]"
        title="Participants"
        v-model="selected"
        :search="handleSearch"
        placeholder="Choose the participants"
      >
        <template #label>
          <ChatConversationModalCurrentUsers :selected="selected" @delete="selected.delete($event)" />
        </template>
        <template #item="{ item }">
          <ChatConversationModalUserItem :user="item" />
        </template>
      </BaseMultiSelect>
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
          :disabled="loading || errorMessage !== null"
        />
      </div>
      <div class="new-error" v-if="errorMessage">
        {{ errorMessage }}
      </div>
    </form>
  </BaseModal>
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
