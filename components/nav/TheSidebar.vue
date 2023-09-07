<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
</script>

<template>
  <Transition name="backdrop-blur">
    <button v-if="layoutStore.sidebarOpen" class="backdrop" @click="layoutStore.setSidebarState(false)"></button>
  </Transition>
  <Transition name="slide-in">
    <nav id="nav" v-if="layoutStore.sidebarOpen">
      <NavTheSearchBar />
      <NavSection
        height="8rem"
        width="100%"
        group="chat"
        :z-index="5"
        :background-color="themeStore.activeTheme.bgColorAlt1"
      >
        <NuxtLink class="router-link" to="/chat">All Chats</NuxtLink>
        <p>Recent Chat #1</p>
        <p>Recent Chat #2</p>
      </NavSection>
      <NavSection
        height="4rem"
        width="90%"
        group="other"
        :z-index="4"
        :background-color="themeStore.activeTheme.bgColorAlt2"
      >
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
      <NavSection
        height="4rem"
        width="80%"
        group="account"
        :z-index="3"
        :background-color="themeStore.activeTheme.bgColorAlt3"
      >
        <p>View account page</p>
        <p>Details about me</p>
        <p>More Details</p>
      </NavSection>
      <div class="recent">
        <!-- TODO: Get font sizes correct -->
        <h4>Recently Viewed</h4>
        <ul>
          <li>Viewed Page</li>
          <li>Viewed Page</li>
          <li>Viewed Page</li>
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

  .recent {
    flex-grow: 1;
    padding: 1rem;
    width: 70%;
    background-color: var(--bg-color-alt4);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    ul > li {
      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }
    }
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate var(--time-400) ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  translate: -100% 0;
}

.backdrop-blur-enter-active,
.backdrop-blur-leave-active {
  transition: backdrop-filter var(--time-250) ease-in-out var(--time-100);
  backdrop-filter: blur(3px);
}

.backdrop-blur-enter-from,
.backdrop-blur-leave-to {
  backdrop-filter: blur(0px);
}

.router-link {
  position: relative;
  color: var(--primary-text);
  display: inline-block;

  &:not(:last-child) {
    margin-bottom: 2px;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &::after {
    content: '';

    position: absolute;
    bottom: -2px;
    left: 0;

    width: 100%;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--time-250) ease;
    border: 1px solid var(--accent);
  }
}

.router-link-active {
  color: var(--secondary-text);
}
</style>
