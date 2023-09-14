<template>
  <button class="button"><slot></slot></button>
</template>

<style scoped>
.button {
  cursor: pointer;
  border-top: 1px solid var(--accent);

  background: linear-gradient(to bottom right, transparent 55%, var(--opposite) 100%);
  background-size: 400%;
  background-position: left;

  transition: all 400ms ease-in, color 400ms ease-out;

  &:hover {
    background-position: 100%;
  }
}
</style>
