<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore()
</script>

<template>
  <div :style="themeStore.activeThemeVariables" id="app-host">
    <NuxtLayout name="main">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<!-- TODO: Make my own page transitions -->
<style>
.page-enter-active,
.page-leave-active {
  transition: all var(--time-400);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

#app-host {
  color: var(--primary-text, '#f4f4f4');
  background-color: var(--bg-color-primary, '#000');
}
</style>
