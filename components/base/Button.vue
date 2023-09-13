<template>
  <button class="button"><slot></slot></button>
</template>

<style scoped>
.button {
  cursor: pointer;
  width: 100%;
  padding: 1rem 0;
  text-align: center;
  border-top: 1px solid var(--accent);

  background: linear-gradient(152deg, var(--bg-primary) 35%, var(--opposite) 100%);
  background-size: 250%;
  background-position: left;

  transition: all 400ms ease-in, color 400ms ease-out;

  &:hover {
    background-position: right;
  }
}
</style>
