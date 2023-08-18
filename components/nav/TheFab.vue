<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
</script>


<template>
  <button @click="layoutStore.toggleOpen">FAB</button>
</template>

<style scoped>
button {
  position: fixed;
  bottom: 4rem;
  right: 4rem;
}
</style>
