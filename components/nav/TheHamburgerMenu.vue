<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
const ariaLabel = computed(() => `${layoutStore.sidebarOpen ? 'Show' : 'Hode'} Sidebar`)
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
  position: sticky;
  top: 0;
  left: 0;
  width: 2rem;
  height: 2rem;
  justify-content: space-between;
  outline: none;
  padding: 0.25rem 0.35rem;

  display: flex;
  flex-direction: column;

  div {
    width: 100%;
    height: 2px;
    background-color: black;
    transition: transform 200ms ease-in;
  }

  div:nth-of-type(1) {
    transform-origin: top left;
  }

  div:nth-of-type(2) {
    transition-delay: 75ms;
    transform-origin: center;
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  div:nth-of-type(3) {
    transform-origin: bottom left;
  }

  &[aria-expanded="true"] {
    div:nth-of-type(1) {
      transform: rotate(45deg) scale(1.4);
    }

    div:nth-of-type(2) {
      transform: scale(0);
    }

    div:nth-of-type(3) {
      transform: rotate(-45deg) scale(1.4);
    }
  }

}
</style>
