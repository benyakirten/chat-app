<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="container">
    <h1 v-if="title">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<style scoped>
.container {
  height: 100%;

  h1 {
    padding-block: 1rem;
    text-transform: capitalize;
    text-align: center;
  }
}
</style>
