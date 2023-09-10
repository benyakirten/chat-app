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

async function handleSubmit() {
  const res = await invoke(isPrivate.value, selected.value, message.value)
  if (!(res instanceof Error)) {
    // emit('close')
  }
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
      <GeneralInputCheckbox v-model="isPrivate"> Private Conversation </GeneralInputCheckbox>
      <GeneralInputAutosize placeholder="Write a message..." label="New Message" v-model="message" />
      <GeneralIconButton
        title="Send message"
        :icon="PaperAirplaneIcon"
        color="var(--highlight)"
        size="1.5rem"
        type="submit"
      />
    </form>
  </BaseModal>
</template>

<style scoped>
.new {
  padding: 2rem;
  width: 50vw;

  display: grid;
  row-gap: 4rem;

  &-item {
    display: grid;
    grid-template-columns: 4rem 1fr;
    column-gap: 2rem;

    min-height: 2rem;
    width: 100%;

    padding: 1rem 0;

    &-avatar {
      grid-column: 1 / 2;
    }

    &-name {
      grid-column: 2 / -1;
    }
  }
}
</style>
