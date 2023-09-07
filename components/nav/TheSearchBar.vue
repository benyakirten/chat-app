<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="search">
    <input class="search-input" placeholder="Search..." disabled />
    <div class="search-icon">
      <MagnifyingGlassIcon aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.search {
  --padding-x-container: 2rem;
  --padding-x-input: 1rem;
  --icon: 2rem;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem var(--padding-x-container);

  &-input {
    height: calc(var(--icon) + 0.5rem);
    width: 100%;

    padding: 0.5rem var(--padding-x-input);
    padding-right: var(--icon);
    border-radius: 4px;
    border: none;

    /* TODO: This is a mess */
    &:disabled {
      background-color: var(--neutral);

      &:placeholder-shown {
        color: var(--bg-color-alt4);
      }
    }
  }

  &-icon {
    position: absolute;
    top: 50%;
    right: calc(var(--padding-x-container) + var(--padding-x-input));
    height: var(--icon);
    width: var(--icon);
    transform: translateY(-50%);
    color: var(--bg-color-alt4);
  }
}
</style>
