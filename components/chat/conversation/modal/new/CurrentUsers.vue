<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{ selected: Set<string>; isNewConversation: boolean }>()
defineEmits<{ (e: 'delete', id: UserId): void }>()
const userStore = useUsersStore()

const getUserName = computed(() => (id: UserId) => userStore.users.get(id)?.name ?? 'Unknown User')
</script>

<template>
  <div class="current-users">
    <h4 class="current-users-title">{{ isNewConversation ? 'Selected' : 'New' }} users:</h4>
    <TransitionGroup name="selected-users">
      <span class="current-users-user" v-for="userId of selected" :key="userId">
        <GeneralAvatar :user-id="userId" :show-online-indicator="true" />
        <span class="current-users-user-name">{{ getUserName(userId) }}</span>
        <GeneralIconButton
          :icon="XCircleIcon"
          title="Remove User"
          type="button"
          @click="$emit('delete', userId)"
          size="1.4rem"
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
  gap: 0.5rem;

  min-height: 3.2rem;

  margin-bottom: 1rem;

  &-title {
    font-weight: normal;
  }

  &-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    padding: 0.5rem 1rem;
    border-radius: 2px;

    background: var(--bg-alt4);
    border: 2px solid var(--neutral);
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
