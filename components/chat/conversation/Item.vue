<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

import type { ConversationId } from '@/stores/messages'

const route = useRoute()
const messageStore = useMessageStore()
const titleStore = useTitleStore()

const { conversationId } = defineProps<{ conversationId: ConversationId }>()
const conversation = messageStore.conversations.get(conversationId)

const points = ref<Map<string, { x: number; y: number }>>(new Map())

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

const unreadMessages = computed(() => messageStore.unreadMessages(conversation))
</script>

<template>
  <li>
    <!-- TODO: Make everything here into its own component, improve CSS -->
    <button class="conversation" @click="viewConversation">
      <GeneralBlip v-for="[id, { x, y }] of points" :key="id" :x="x" :y="y" />
      <Transition name="unread">
        <span class="conversation-unread" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
      </Transition>
      <span class="conversation-participants">
        {{ titleStore.conversationSubtitle(conversation) }}
      </span>
      <Transition name="active">
        <span v-if="route.params['id'] === conversationId" class="conversation-active">
          <ChevronRightIcon />
        </span>
      </Transition>
    </button>
  </li>
</template>

<style scoped>
.conversation {
  border-bottom: 1px solid var(--accent);
  position: relative;

  overflow: hidden;

  display: grid;
  grid-template-columns: 4rem 1fr 2rem;
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
    justify-content: center;
    grid-column: 2 / 3;
    text-overflow: ellipsis;
  }

  &-active {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;
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

/* TODO: Figure out why this transition isn't working */
.active-enter-from,
.active-leave-to {
  opacity: 0;
  scale: 0.5;
}

.active-enter-active,
.active-leave-active {
  transition: opacity var(--time-200) ease-in, scale var(--time-250) ease;
}
</style>
