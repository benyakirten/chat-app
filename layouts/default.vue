<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
</script>

<template>
  <div class="container">

    <button @click="layoutStore.toggleOpen">FAB</button>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.container {
  position: relative;

  main {
    width: 100%;
  }
}
</style>
