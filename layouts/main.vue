<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="container">
    <NavTheSidebar />
    <NavTheHamburgerMenu />
    <main :class="{ filter: layoutStore.sidebarOpen }">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  max-width: 100vw;

  main {
    min-height: 100vh;
  }
}
</style>
