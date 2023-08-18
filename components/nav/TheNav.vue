<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
</script>

<template>
  <nav v-if="layoutStore.sidebarOpen">
    <NuxtLink to="/">HOME</NuxtLink>
    <NuxtLink to="/about">ABOUT</NuxtLink>
    <NuxtLink to="/messages">MESSAGES</NuxtLink>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 20%;
}
</style>
