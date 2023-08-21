<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
import { useThemeStore } from "@/stores/theme";

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
</script>

<template>
  <Transition name="fade-in">
    <div v-if="layoutStore.sidebarOpen" class="backdrop" @click="layoutStore.setSidebarState(false)"></div>
  </Transition>
  <Transition name="slide-in">
    <nav v-if="layoutStore.sidebarOpen">
      <NavSection height="4rem" width="100%" group="chat" :z-index="5"
        :background-color="themeStore.activeTheme.bgColorAlt1">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
      <NavSection height="4rem" width="95%" group="other" :z-index="4"
        :background-color="themeStore.activeTheme.bgColorAlt2">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
      <NavSection height="4rem" width="90%" group="account" :z-index="3"
        :background-color="themeStore.activeTheme.bgColorAlt3">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
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
  position: absolute;
  top: 0;
  left: 0;

  z-index: 1;
  opacity: 1;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
  /* Reconsider how this background works */
  /* --backdrop-color-1: color-mix(in srgb, var(--primary-text) 40%, transparent);
  --backdrop-color-2: color-mix(in srgb, var(--primary-text) 20%, transparent);
  --backdrop-color-3: color-mix(in srgb, var(--primary-text) 10%, transparent);
  background: linear-gradient(to bottom right,
      var(--backdrop-color-1) 25%,
      var(--backdrop-color-2) 80%,
      var(--backdrop-color-3)); */
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity var(--time-250) ease-in-out var(--time-100);
  transform-origin: left;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

nav {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 70%;

  .recent {
    flex-grow: 1;
    padding: 1rem;
    width: 80%;
    background-color: v-bind('themeStore.activeTheme.bgColorAlt4')
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
</style>
