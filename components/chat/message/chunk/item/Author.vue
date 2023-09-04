<script setup lang="ts">

const { name } = defineProps<{ name?: string }>()
</script>

<template>
  <div class="author">{{ name ?? "Unknown User" }}</div>
</template>

<style scoped>
.author {
  color: var(--highlight);
}
</style>
