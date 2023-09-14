<script setup lang="ts">
const { isMine } = defineProps<{ isMine: boolean }>()
</script>

<template>
  <div class="tail" :class="isMine ? 'tail-right' : 'tail-left'"></div>
</template>

<style scoped>
.tail {
  place-self: end;
  width: 1rem;
  height: 1rem;
  position: absolute;

  --dist: 1rem;

  &-left {
    background-color: var(--base);
    left: calc(-1 * var(--dist));
    bottom: var(--dist);
    clip-path: polygon(0 100%, 100% 100%, 100% 0);
  }

  &-right {
    background-color: var(--bg-alt2);
    right: calc(-1 * var(--dist));
    bottom: var(--dist);
    clip-path: polygon(0 0, 0 100%, 100% 100%);
  }
}
</style>
