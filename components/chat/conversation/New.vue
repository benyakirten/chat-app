<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

import { User, useUsersStore } from '@/stores/users'
import { useMessageStore } from '@/stores/messages'

const { open } = defineProps<{ open: boolean }>()
const userStore = useUsersStore()
const messageStore = useMessageStore()
const selected = ref<Set<string>>(new Set())
const message = ref('')

function handleSubmit() {
  messageStore.startConversation(selected.value, message.value)
}

const handleSearch = (user: User, search: string) => user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
</script>

<template>
  <BaseModal @close="$emit('close')" :open="open">
    <form @submit.prevent="handleSubmit" class="new">
      <BaseMultiSelect
        :options="[...userStore.users.values()]"
        title="Participants"
        :selected="selected"
        :search="handleSearch"
        placeholder="Choose the participants"
        @select="selected.add($event)"
        @deselect="selected.delete($event)"
      >
        <template #label>
          <!-- TODO: Refactor this into a component -->
          <div class="new-label">
            <span>Current users:</span>
            <TransitionGroup name="selected-users">
              <span class="new-label-user" v-for="userId of selected" :key="userId">
                <span class="new-label-user-name">{{ userStore.users.get(userId)?.name ?? 'Unknown User' }}</span>
                <button class="new-label-user-remove" @click="selected.delete(userId)">
                  <XCircleIcon />
                </button>
              </span>
            </TransitionGroup>
          </div>
        </template>
        <template #item="{ item }">
          <div class="new-item">
            <div class="new-item-avatar">
              <GeneralAvatar :user-id="item.id" />
            </div>
            <span class="new-item-name">{{ item.name }}</span>
          </div>
        </template>
      </BaseMultiSelect>
      <GeneralInputAutosize placeholder="Write a message..." label="New Message" v-model="message" />
      <GeneralIconButton title="Send message" :icon="PaperAirplaneIcon" size="0.8rem" type="submit" />
    </form>
  </BaseModal>
</template>

<style scoped>
.new {
  padding: 2rem;

  display: grid;
  place-items: center;

  &-label {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  &-item {
    display: grid;
    grid-template-columns: 4rem 1fr;
    column-gap: 2rem;

    min-height: 2rem;
    width: 100%;

    padding: 1rem 0;

    &-avatar {
      grid-column: 1 / 2;
    }

    &-name {
      grid-column: 2 / -1;
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
