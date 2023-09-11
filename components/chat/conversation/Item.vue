<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { ChevronRightIcon, CogIcon } from '@heroicons/vue/24/outline'

import type { ConversationId } from '@/stores/messages'

const route = useRoute()
const messageStore = useMessageStore()
const titleStore = useTitleStore()

const props = defineProps<{ conversationId: ConversationId }>()
const emit = defineEmits<{ (e: 'modify'): void }>()
const conversation = messageStore.conversations.get(props.conversationId)

const points = ref<Map<string, { x: number; y: number }>>(new Map())

async function viewConversation(e: MouseEvent) {
  await navigateTo(`/chat/${props.conversationId}`)

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
      <button class="conversation-settings" v-if="!conversation?.isPrivate">
        <GeneralIconButton
          :icon="CogIcon"
          title="Settings"
          color="var(--highlight)"
          size="1.5rem"
          @click.stop="emit('modify')"
        />
      </button>
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
  grid-template-columns: 1rem 2rem 1fr 2rem 2rem;

  min-height: 2rem;
  width: 100%;

  padding: 1rem 0;

  background-color: var(--bg-color-primary);
  color: var(--primary-text);

  &-unread {
    font-size: 1rem;
    align-self: center;
    justify-content: center;
    color: var(--highlight);
    grid-column: 2 / 3;
  }

  &-participants {
    display: flex;
    align-items: center;
    grid-column: 3 / 4;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-settings {
    grid-column: 4 / 5;
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;
  }

  &-active {
    grid-column: 5 / -1;
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
