<script setup lang="ts">
const { name, justify } = defineProps<{ name?: string; justify: 'flex-end' | 'flex-start' }>()
</script>

<template>
  <div class="author">{{ name ?? 'Unknown User' }}</div>
</template>

<style scoped>
.author {
  font-size: var(--text-size-xl);
  color: var(--highlight);
  justify-self: v-bind(justify);
}
</style>
