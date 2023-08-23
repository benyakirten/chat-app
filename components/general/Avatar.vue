<script lang="ts" setup>
import { User } from '@/stores/users';

const { users, size } = withDefaults(defineProps<{ users: User[], size?: string }>(), {
  size: "1.5rem",
})
const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
function emitClick(e: MouseEvent) {
  e.stopPropagation()
  emits('click', e)
}
</script>

<template>
  <button class="avatar" @click="emitClick">
    <!-- Should this show unread messages? What should this represent? -->
    <span>{{ users.length }}</span>
  </button>
</template>

<style scoped>
.avatar {
  position: relative;
  align-self: center;
  display: grid;
  place-items: center;

  width: v-bind(size);
  height: v-bind(size);

  border-radius: 9999px;
  border: 1px solid var(--secondary-text);

  &:hover {
    background-color: var(--primary-text);
  }

  /* &::after {
    content: "More information";

    position: absolute;
    bottom: 0;

    border-radius: 9999px;
    border: 1px solid var(--bg-color-alt4);
    background-color: var(--text-primary);
    color: var(--bg-color-primary);

    width: 100%;
    height: 20%;
    scale: 1 0;
    transition: scale var(--time-150) ease-in;

    background-color: var(--bg-color-primary);
    color: var(--text-primary);
  }

  &:hover::after {
    scale: 1 1;
  } */

  span {
    font-size: calc(v-bind(size) * 0.75);
  }
}
</style>
