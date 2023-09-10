<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

import type { User } from '@/stores/users'

const { open } = defineProps<{ open: boolean }>()
const userStore = useUsersStore()
const messageStore = useMessageStore()
const selected = ref<Set<string>>(new Set())
const message = ref('')
const isPrivate = ref(true)

function handleSubmit() {
  messageStore.startConversation(isPrivate.value, selected.value, message.value)
}

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
</script>

<template>
  <BaseModal @close="$emit('close')" :open="open">
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
      <GeneralInputAutosize placeholder="Write a message..." label="New Message" v-model="message" />
      <GeneralIconButton title="Send message" :icon="PaperAirplaneIcon" size="1.5rem" type="submit" />
    </form>
  </BaseModal>
</template>

<style scoped>
.new {
  padding: 2rem;

  display: grid;
  row-gap: 4rem;
  place-items: center;

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
