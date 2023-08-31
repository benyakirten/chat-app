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
    <div class="spacer"></div>
    <button class="container" @click="viewConversation">
      <Transition name="unread">
        <!-- TODO: Make everythign here into its own component, improve CSS -->
        <div class="unread" v-if="conversation.unreadMessages > 0">{{ conversation.unreadMessages }}</div>
      </Transition>
      <span>
        <!-- TODO: Make this better -->
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
  padding: 0.5rem 0;

  height: 4rem;

  background-color: var(--bg-color-primary);
  color: var(--primary-text);

  /* TODO: Replace this with padding - figure out why padding is disrupting shape */
  .spacer {
    width: 0.5rem;
  }
}

.unread {
  font-size: 1.4rem;
  align-self: center;
  color: var(--highlight);
}

.unread-enter-from,
.unread-leave-to {
  opacity: 0;
}

.unread-enter-active,
.unread-leave-active {
  transition: opacity var(--time-100) ease-in;
  opacity: 1;
}
</style>
