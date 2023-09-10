<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'

import type { UserId } from '@/stores/messages'

defineProps<{ selected: Set<string> }>()
defineEmits<{ (e: 'delete', id: UserId): void }>()
const userStore = useUsersStore()
</script>

<template>
  <div class="current-users">
    <span>Current users:</span>
    <TransitionGroup name="selected-users">
      <span class="current-users-user" v-for="userId of selected" :key="userId">
        <span class="current-users-user-name">{{ userStore.users.get(userId)?.name ?? 'Unknown User' }}</span>
        <button class="current-users-user-remove" @click="$emit('delete', userId)">
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
  gap: 2rem;

  &-user {
    &-name {
      /*  */
    }
    &-remove {
      /*  */
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
