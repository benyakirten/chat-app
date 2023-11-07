<template>
  <div class="item"><slot></slot></div>
</template>

<style scoped>
.item {
  color: var(--text-color);
  font-size: var(--text-size-xl);
  text-transform: capitalize;

  display: flex;
  padding-inline: 1rem;
  padding-block: 0.4rem;
  align-items: center;
}
</style>
