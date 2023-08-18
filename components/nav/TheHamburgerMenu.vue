<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
const ariaLabel = computed(() => `${layoutStore.sidebarOpen ? 'Show' : 'Hide'} Sidebar`)
</script>

<template>
  <button @click="layoutStore.toggleOpen" :aria-label="ariaLabel" :aria-expanded="layoutStore.sidebarOpen">
    <div :aria-hidden="true"></div>
    <div :aria-hidden="true"></div>
    <div :aria-hidden="true"></div>
  </button>
</template>

<style scoped>
button {
  position: fixed;
  cursor: pointer;
  z-index: 2;
  bottom: 4rem;
  right: 4rem;

  padding: 1rem;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  border-radius: 4px;
  background-color: lightgreen;
  border: none;
  height: 3rem;

  div {
    width: 1rem;
    height: 2px;
    background-color: black;
    transition: rotate 200ms ease-in, scale 200ms ease-in 100ms;
  }

  div:nth-of-type(1) {
    transform-origin: top left;
  }

  div:nth-of-type(2) {
    transition-delay: 150ms;
    transform-origin: center;
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  div:nth-of-type(3) {
    transform-origin: bottom left;
  }

  &[aria-expanded="true"] {
    div:nth-of-type(1) {
      rotate: 45deg;
      scale: 1.25 1;
    }

    div:nth-of-type(2) {
      scale: 0;
    }

    div:nth-of-type(3) {
      rotate: -45deg;
      scale: 1.25 1;
    }
  }

}
</style>
