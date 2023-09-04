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
  background-color: var(--bg-color-alt1);
  position: absolute;

  --dist: 0.75rem;

  &-left {
    left: calc(-1 * var(--dist));
    bottom: var(--dist);
    clip-path: polygon(0 100%, 100% 100%, 100% 0);
  }

  &-right {
    right: calc(-1 * var(--dist));
    bottom: var(--dist);
    clip-path: polygon(0 0, 0 100%, 100% 100%);
  }
}
</style>
