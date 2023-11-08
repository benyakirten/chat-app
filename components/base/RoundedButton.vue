<template>
  <button class="rounded-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.rounded-button {
  border-radius: 9999px;
  padding-inline: 1.5rem;
  padding-block: var(--size-md);

  background-color: var(--text-color);
  color: var(--bg-primary);

  text-align: center;
  font-size: var(--text-size-xl);
}
</style>
