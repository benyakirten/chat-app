<template>
  <button class="button"><slot></slot></button>
</template>

<style scoped>
.button {
  cursor: pointer;
  border-top: 1px solid var(--accent);

  background: linear-gradient(to bottom right, var(--bg-primary) 25%, var(--opposite) 100%);
  background-size: 250%;
  background-position: left;

  transition: all 400ms ease-in, color 400ms ease-out;

  &:hover {
    background-position: right;
  }
}
</style>
