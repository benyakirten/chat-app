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
      <NavSection height="4rem" width="12rem" group="chat" :z-index="5" background-color="green">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
      <NavSection height="4rem" width="11rem" group="other" :z-index="4" background-color="lightgreen">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
      <NavSection height="4rem" width="10rem" group="account" :z-index="3" background-color="lightblue">
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
        <p>SAMPLE TEXT</p>
      </NavSection>
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
  background: linear-gradient(to bottom right, #00000040 25%, #00000020 80%, #00000010);
  opacity: 1;
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
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate var(--time-250) ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  translate: -100% 0;
}
</style>
