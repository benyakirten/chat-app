<script setup lang="ts">
import { useMediaStore } from '~/stores/media'

const recentsStore = useRecentsStore()
const messageStore = useMessageStore()
const titleStore = useTitleStore()
const layoutStore = useLayoutStore()
const userStore = useUsersStore()

function getConversationFromRoute(route: string) {
  const segments = route.split('/')
  if (segments.length < 3) {
    return titleStore.conversationSubtitle()
  }

  const id = segments[segments.length - 1]
  const conversation = messageStore.conversation(id)
  return titleStore.conversationSubtitle(conversation)
}

function getTitle(route: string) {
  const segments = route.split('/')
  const id = segments.at(segments.length - 1)
  return titleStore.title(route, id)
}

const me = computed(() => userStore.users.get(userStore.me?.id ?? ''))
</script>

<template>
  <Transition name="backdrop-blur">
    <button v-if="layoutStore.sidebarOpen" class="backdrop" @click="layoutStore.setSidebarState(false)"></button>
  </Transition>
  <Transition name="slide-in">
    <nav id="nav" v-if="layoutStore.sidebarOpen">
      <NavSection height="8rem" width="100%" group="chat" :z-index="5" background-color="var(--bg-alt1)">
        <BaseLink to="/chat">All Chats</BaseLink>
        <div v-if="recentsStore.chatLRU.cache.length === 0">No recently viewed chats.</div>
        <ul v-else>
          <li v-for="recentChat of recentsStore.chatLRU.cache" :key="recentChat">
            <BaseLink :to="recentChat">
              {{ getConversationFromRoute(recentChat) }}
            </BaseLink>
          </li>
        </ul>
      </NavSection>
      <NavSection height="4rem" width="90%" group="account" :z-index="3" background-color="var(--bg-alt3)">
        <BaseLink to="/account">Settings</BaseLink>
        <div class="nav-account">
          <div>Name: {{ me?.name ?? 'Unknown User' }}</div>
          <!-- Other data: number of private conversations, group conversations, interests?, etc. -->
        </div>
      </NavSection>
      <div class="recent">
        <h4>Recently Viewed</h4>
        <div v-if="recentsStore.allLRU.cache.length === 0">No recently viewed pages.</div>
        <ul v-else>
          <li v-for="recent of recentsStore.allLRU.cache" :key="recent">
            <BaseLink :to="recent">
              {{ getTitle(recent) }}
            </BaseLink>
          </li>
        </ul>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.backdrop {
  cursor: default;
  position: absolute;
  top: 0;
  left: 0;

  z-index: 1;
  opacity: 1;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
  backdrop-filter: blur(3px);
}

nav {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 40%;
  transition: width 200ms ease;

  @media (width <= 910px) {
    width: 50%;
  }

  @media (width <= 650px) {
    width: 60%;
  }

  @media (width <= 550px) {
    width: 75%;
  }

  .recent {
    flex-grow: 1;
    padding: 1rem;
    width: 80%;
    background-color: var(--bg-alt4);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    h4 {
      font-size: var(--text-xxl);
    }

    ul > li {
      margin-bottom: 0.5rem;
    }
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate 400ms ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  translate: -100% 0;
}

.backdrop-blur-enter-active,
.backdrop-blur-leave-active {
  transition: backdrop-filter 250ms ease-in-out 100ms;
  backdrop-filter: blur(3px);
}

.backdrop-blur-enter-from,
.backdrop-blur-leave-to {
  backdrop-filter: blur(0px);
}
</style>
