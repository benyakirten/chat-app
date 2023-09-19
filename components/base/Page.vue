<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="page">
    <h1 v-if="title">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<style scoped>
.page {
  height: 100%;

  h1 {
    padding-block: 1rem;
    text-transform: capitalize;
    text-align: center;
  }
}
</style>
