<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <NuxtLink class="router-link" :to="to">
    <slot></slot>
  </NuxtLink>
</template>

<style scoped>
.router-link {
  position: relative;
  display: inline-block;

  color: var(--text);

  margin-bottom: 4px;

  &:focus,
  &:hover {
    &::after {
      transform: scaleX(1);
    }
  }

  &::after {
    content: '';

    position: absolute;
    bottom: -2px;
    left: 0;

    width: 100%;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms ease;
    border: 1px solid var(--accent);
  }

  &:active {
    transition: all 400ms ease;
  }

  &-active::after {
    width: calc(100% + 1rem);
  }

  &-active::before {
    content: '<';

    position: absolute;
    top: 50%;
    right: -1rem;

    transform: translateY(-50%);
  }
}
</style>
