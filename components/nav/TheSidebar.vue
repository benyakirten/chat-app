<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
</script>

<template>
  <Transition name="fade-in">
    <div v-if="layoutStore.sidebarOpen" class="backdrop"></div>
  </Transition>
  <Transition name="slide-in">
    <nav v-if="layoutStore.sidebarOpen">
      <NuxtLink to="/">HOME</NuxtLink>
      <NuxtLink to="/about">ABOUT</NuxtLink>
      <NuxtLink to="/messages">MESSAGES</NuxtLink>
    </nav>
  </Transition>
</template>

<style scoped>
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #00000030 25%, #00000040 80%, #00000060);
  opacity: 1;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 250ms ease-in-out 100ms;
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

  background-color: lightgreen;

  display: flex;
  flex-direction: column;
  width: 20%;
  min-height: 100vh;

  padding: 2rem 1rem;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate 250ms ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  translate: -100% 0;
}
</style>
