<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <NuxtLink class="router-link" :to="to">
    <slot></slot>
  </NuxtLink>
</template>

<style scoped>
.router-link {
  &-active {
    color: var(--secondary-text);
  }
}
</style>
