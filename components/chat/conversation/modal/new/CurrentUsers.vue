<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{ selected: Set<string>; canDelete: boolean }>()
defineEmits<{ (e: 'delete', id: UserId): void }>()
const userStore = useUsersStore()

const getUserName = computed(() => (id: UserId) => userStore.users.get(id)?.name ?? 'Unknown User')
</script>

<template>
  <div class="current-users">
    <h4 class="current-users-title">Current users:</h4>
    <TransitionGroup name="selected-users">
      <span class="current-users-user" v-for="userId of selected" :key="userId">
        <span class="current-users-user-name">{{ getUserName(userId) }}</span>
        <GeneralIconButton
          v-if="canDelete"
          :icon="XCircleIcon"
          title="Remove Users"
          type="button"
          @click="$emit('delete', userId)"
          size="1.2rem"
        />
      </span>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.current-users {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
  height: 2.5rem;
  gap: 0.5rem;

  overflow-x: hidden;

  /* TODO: Make this better */

  &-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    padding: 0.5rem 1rem;
    border-radius: 2px;

    background: linear-gradient(to top right, var(--bg-alt1), var(--bg-alt5));
    background-size: 200%;
    background-position: left;

    transition: all 300ms ease-out;

    &:hover {
      background-position: right;
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
