<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section>
    <h2 class="title">{{ title }}</h2>
    <div class="group">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.title {
  text-decoration: underline;
  padding-bottom: 2px;
  margin-bottom: 2rem;
}

.group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;

  & > * {
    max-width: 40rem;
    max-height: 40rem;
  }

  @media (width < 600px) {
    grid-template-columns: 1fr;
  }
}
</style>
