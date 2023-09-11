<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'

import type { UserId } from '@/stores/messages'

defineProps<{ selected: Set<string> }>()
defineEmits<{ (e: 'delete', id: UserId): void }>()
const userStore = useUsersStore()
</script>

<template>
  <div class="current-users">
    <h4 class="current-users-title">Current users:</h4>
    <TransitionGroup name="selected-users">
      <span class="current-users-user" v-for="userId of selected" :key="userId">
        <span class="current-users-user-name">{{ userStore.users.get(userId)?.name ?? 'Unknown User' }}</span>
        <button class="current-users-user-remove" @click="$emit('delete', userId)" type="button">
          <XCircleIcon />
        </button>
      </span>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.current-users {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 2.5rem;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  &-title {
    padding: 0.5rem 1rem;
  }

  /* TODO: Make this better */

  &-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--bg-color-alt3);
    border-radius: 2px;

    &-name {
      /*  */
    }
    &-remove {
      color: var(--highlight);
      width: 1.2rem;
      height: 1.2rem;
      opacity: 0.9;
      transition: scale var(--time-100) ease var(--time-100), opacity var(--time-200) ease;

      &:hover,
      &:focus {
        scale: 1.1;
        opacity: 1;
      }
    }
  }
}
/* TODO: Make this style unique */
.selected-users-move,
.selected-users-enter-active,
.selected-users-leave-active {
  transition: all 0.5s ease;
}

.selected-users-enter-from,
.selected-users-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.selected-users-leave-active {
  position: absolute;
}
</style>
