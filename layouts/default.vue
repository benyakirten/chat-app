<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useThemeStore } from '@/stores/theme';

const layoutStore = useLayoutStore()
const themeStore = useThemeStore()
</script>

<template>
  <div class="container" :style="themeStore.activeThemeVariables" id="app-host">
    <NavTheSidebar />
    <NavTheHamburgerMenu />
    <ToasterComponent />
    <main :class="{ filter: layoutStore.sidebarOpen }">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.container {
  color: var(--primary-text, '#f4f4f4');
  background-color: var(--bg-color-primary, '#000');

  position: relative;
  max-width: 100vw;

  main {
    min-height: 100vh;
  }
}
</style>
