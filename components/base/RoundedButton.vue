<template>
  <button class="rounded-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.rounded-button {
  display: grid;
  place-items: center;

  border-radius: 9999px;
  padding-inline: 1.5rem;
  padding-block: var(--size-md);

  --background-mix: color-mix(in srgb, var(--accent) 80%, var(--mix));
  background: var(--button-bg);
  background-size: 200%;
  background-position: left;
  color: var(--text-color);

  font-size: var(--text-size-xl);

  transition: background-position 500ms ease-out;

  &:not(:disabled):hover {
    background-position: right;
  }

  &:disabled {
    cursor: default;
    background: var(--color-neutral);
  }
}
</style>
