<script lang="ts" setup>

import type { Conversation } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const { conversation } = defineProps<{ conversation: Conversation }>()
const userStore = useUsersStore()
const users = userStore.getOtherUsers([...conversation.members.keys()])

async function viewConversation() {
  await navigateTo({ query: { id: conversation.conversationId } })
}
</script>

<template>
  <li class="conversation">
    <button class="container" @click="viewConversation">
      <GeneralAvatar :users="users" />
      <span>
        {{ users.map(user => user.name).join(", ") }}
      </span>
    </button>
  </li>
</template>

<style scoped>
.conversation {
  border-bottom: 1px solid var(--accent);
}

.container {
  position: relative;

  display: flex;
  gap: 2rem;
  padding-top: 0.5rem;
  padding-left: 1rem;

  height: 4rem;
  width: 100%;

  background-color: var(--bg-color-primary);
  color: var(--primary-text);
}
</style>
