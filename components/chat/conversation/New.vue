<script setup lang="ts">
const x = ref('0px')
const y = ref('0px')

function setMousePosition(e: MouseEvent) {
  const pos = getMouseRelativePosition(e)
  x.value = `${pos.x}px`
  y.value = `${pos.y}px`
}
</script>

<template>
  <button @mouseover="setMousePosition" class="new">Start a new conversation</button>
</template>

<style scoped>
.new {
  /* TODO: Make this into a gradient that moves when hovered - maybe some sort of base button */
  cursor: pointer;
  width: 100%;
  padding: 1rem 0;
  text-align: center;

  transition: background-color 150ms ease-in, color 150ms ease-out;

  border-top: 1px solid var(--accent);

  &:hover {
    color: var(--text);
    background-color: var(--bg-alt4);
  }
}
</style>
