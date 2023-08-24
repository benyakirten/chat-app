<script lang="ts" setup>
import type { Conversation } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const { conversation } = defineProps<{ conversation: Conversation }>()
const userStore = useUsersStore()
const users = userStore.getOtherUsers(conversation.members)

async function viewConversation() {
  await navigateTo(`/chat/${conversation.conversationId}`)
}
</script>

<template>
  <li class="conversation">
    <button class="container" @click="viewConversation">
      <Transition name="unread">
        <!-- TODO: Make everythign here into its own component, improve CSS -->
        <div class="unread" v-if="conversation.unreadMessages > 0">{{ conversation.unreadMessages }}</div>
      </Transition>
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
  padding-right: 0.5rem;
}

.container {
  position: relative;

  display: flex;
  gap: 2rem;
  padding-top: 0.5rem;
  padding-left: 1rem;

  height: 4rem;

  background-color: var(--bg-color-primary);
  color: var(--primary-text);
}

.unread {
  font-size: 1.4rem;
  align-self: center;
  color: var(--highlight);
}

.unread-enter-from,
.unread-leave-to {
  scale: 0;
}

.unread-enter-active,
.unread-leave-active {
  transition: scale var(--time-250) ease-in;
  scale: 1;
}
</style>
