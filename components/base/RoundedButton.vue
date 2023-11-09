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
  background: linear-gradient(
    45deg,
    var(--accent) 0%,
    var(--background-mix) 35%,
    var(--accent) 65%,
    var(--background-mix)
  );
  background-size: 200%;
  background-position: left;
  color: var(--text-color);

  font-size: var(--text-size-xl);

  transition: background-position 500ms ease-out;

  &:hover {
    background-position: right;
  }
}
</style>
