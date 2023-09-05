<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useThemeStore } from '@/stores/theme';
import { useTitleStore } from '@/stores/title';

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
const titleStore = useTitleStore()
</script>

<template>
  <Head>
    <Title>{{ titleStore.title }}</Title>
  </Head>
  <div
    class="container"
    :style="themeStore.activeThemeVariables"
    id="app-host"
  >
    <NavTheSidebar />
    <NavTheHamburgerMenu />
    <ToasterComponent />
    <main :class="{ filter: layoutStore.sidebarOpen }">
      <slot></slot>
    </main>
  </div>
</template>

<style>
#app-host {
  color: var(--primary-text, '#f4f4f4');
  background-color: var(--bg-color-primary, '#000');

  position: relative;
  max-width: 100vw;

  main {
    min-height: 100vh;
  }
}

.page-leave-active,
.page-enter-active {
  transition: all var(--time-300) ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0.5;
  filter: blur(4px);
}
</style>
