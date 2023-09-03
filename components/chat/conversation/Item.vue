<script lang="ts" setup>
import { v4 as uuid } from "uuid";

import { ConversationId, useMessageStore } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const messageStore = useMessageStore()
const userStore = useUsersStore()

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const conversation = messageStore.conversations.get(conversationId)

const points = ref<Map<string, { x: number, y: number }>>(new Map())

async function viewConversation(e: MouseEvent) {
  await navigateTo(`/chat/${conversationId}`)

  // TODO: Make this into a hook/component/reusable instead of magic numbers
  // TODO: Figure out the best way to tie the timeout with the animation length
  if (!(e.target instanceof HTMLButtonElement)) {
    return
  }

  const id = uuid()
  const { left, top } = e.target.getBoundingClientRect()
  const { clientX, clientY } = e

  const x = clientX - left
  const y = clientY - top

  points.value.set(id, { x, y })
  setTimeout(() => {
    points.value.delete(id)
  }, 400)
}


</script>

<template>
  <li>
    <!-- TODO: Clean up this template -->
    <button class="conversation" @click="viewConversation">
      <GeneralBlip v-for="[id, { x, y }] of points" :key="id" :x="x" :y="y" />
      <Transition name="unread">
        <!-- TODO: Make everything here into its own component, improve CSS -->
        <span class="conversation-unread" v-if="conversation?.unreadMessages && conversation.unreadMessages > 0">{{
          conversation.unreadMessages }}</span>
      </Transition>

      <span class="conversation-participants">
        <!-- TODO: Make this better -->
        {{ conversation ? userStore.getOtherUsers(conversation.members).map(user => user.name).join(", ") : `Unable to
        determine other participants in conversation` }}
      </span>
    </button>
  </li>
</template>

<style scoped>
.conversation {
  border-bottom: 1px solid var(--accent);
  position: relative;

  overflow: hidden;
  user-select: none;

  display: grid;
  grid-template-columns: 4rem 1fr;
  column-gap: 2rem;

  min-height: 2rem;
  width: 100%;

  padding: 1rem 0;

  background-color: var(--bg-color-primary);
  color: var(--primary-text);

  &-unread {
    font-size: 1.4rem;
    justify-self: center;
    align-self: center;
    color: var(--highlight);
    grid-column: 1 / 2;
  }

  &-participants {
    display: flex;
    align-items: center;
    justify-items: center;
    grid-column: 2 / -1;
    user-select: auto;
  }
}


.unread-enter-from,
.unread-leave-to {
  opacity: 0;
  scale: 0.5;
}

.unread-enter-active,
.unread-leave-active {
  transition: opacity var(--time-200) ease-in, scale var(--time-250) ease;
}
</style>
