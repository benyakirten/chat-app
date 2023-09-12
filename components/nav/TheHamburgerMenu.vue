<script setup lang="ts">
const layoutStore = useLayoutStore()
const ariaLabel = computed(() => `${layoutStore.sidebarOpen ? 'Hide' : 'Show'} Sidebar`)
</script>

<template>
  <button
    @click="layoutStore.toggleOpen"
    :aria-label="ariaLabel"
    :aria-expanded="layoutStore.sidebarOpen"
    aria-controls="nav"
  >
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
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
  height: 1rem;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  border-radius: 4px;
  background-color: var(--accent);
  border: none;

  div {
    width: 1rem;
    height: 2px;
    background-color: var(--bg-color-primary);
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

  &[aria-expanded='true'] {
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
