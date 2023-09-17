<script lang="ts" setup>
import { ChevronRightIcon, CogIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const messageStore = useMessageStore()
const titleStore = useTitleStore()
const mediaStore = useMediaStore()
const modalStore = useModalStore()

const props = defineProps<{ conversation: Conversation }>()

async function viewConversation() {
  mediaStore.conversationListOpen = false
  await navigateTo(`/chat/${props.conversation.id}`)
}

const unreadMessages = computed(() => messageStore.unreadMessages(props.conversation))
</script>

<template>
  <li>
    <button class="conversation" @click="viewConversation">
      <Transition name="unread">
        <span class="conversation-unread" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
      </Transition>
      <span class="conversation-participants">
        <span class="conversation-participants-child">
          {{ titleStore.conversationSubtitle(conversation) }}
        </span>
      </span>
      <button class="conversation-settings" v-if="!conversation?.isPrivate">
        <GeneralIconButton
          :icon="CogIcon"
          title="Settings"
          size="1.5rem"
          @click.stop="modalStore.modifyConversation(conversation.id)"
        />
      </button>
      <!-- Remove a transition from this since I cannot get it to react to route params -->
      <ChevronRightIcon class="conversation-active" v-if="route.params['id'] === conversation.id" aria-hidden="true" />
    </button>
  </li>
</template>

<style scoped>
.conversation {
  border-bottom: 1px solid var(--accent);
  position: relative;

  display: grid;
  grid-template-columns: 1rem 2rem 1fr 2rem 2rem;
  align-content: center;

  height: 2rem;
  width: 100%;

  padding: 1rem 0;
  background: linear-gradient(to right, transparent 50%, var(--bg-primary), var(--base));
  background-position: left;
  background-size: 200%;
  transition: background-position 250ms ease-out;

  color: var(--text);

  &:hover {
    background-position: right;
  }

  &-unread {
    font-size: 1rem;
    align-self: center;
    justify-content: center;
    color: var(--highlight);
    grid-column: 2 / 3;
  }

  &-participants {
    grid-column: 3 / 4;

    display: flex;
    align-items: center;
    overflow: hidden;

    /*
      TODO: Investigate: Is this extra nesting necessary?
      We use flex box to make sure the text is centered
      because the grid column will grow with the addition
      of the icon at the end.
      And I'm not sure how to get the text overflow to work
      correct otherwise.
    */
    &-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
  }

  &-settings {
    grid-column: 4 / 5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-active {
    grid-column: 5 / -1;
  }
}

.unread-enter-from,
.unread-leave-to {
  opacity: 0;
  scale: 0.5;
}

.unread-enter-active,
.unread-leave-active {
  transition: opacity 200ms ease-in, scale 250ms ease;
}
</style>
