<script lang="ts" setup>
import { UserReadTimes, type ConversationMessage } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()
const { message, userReadTimes, isLastMessage } = defineProps<{ message: ConversationMessage, userReadTimes: UserReadTimes, isLastMessage: boolean }>()
const isMine = computed(() => userStore.isMine(message))

const readList = computed(() => {
  const readUsers: string[] = []

  // TODO: Flatten this
  for (const userId in userReadTimes) {
    const readTime = userReadTimes[userId]
    if (readTime.valueOf() > message.createTime.valueOf()) {
      const user = userStore.users.get(userId)
      if (user) {
        readUsers.push(user.name)
      }
    }
  }

  return readUsers
})

const status = computed(() => {
  if (message.status !== 'complete') {
    return message.status
  }

  return readList.value.length > 0 ? 'read' : 'sent'
})
</script>

<template>
  <div class="container" :class="{ right: isMine }">
    <!-- TODO: Upgrade this styling -->
    <span class="author" :class="{ right: isMine }">
      From {{ isMine ? 'Me' : userStore.users.get(message.sender)?.name ?? "Unknown" }}, {{ new
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'short', timeStyle: 'short'
        }).format(message.createTime) }}
    </span>
    <span class="message" :class="{ right: isMine }">
      <span>
        {{ message.content }}
      </span>
      <div></div>
    </span>
    <span class="bottom-data right" v-if="isMine">
      <!-- TODO: Add tooltip, add pending indicator, add retry button, add, if successful, edit/delete buttons -->
      <span class="self-controls">
        <button>Edit</button>
        <button>Delete</button>
      </span>
      <span class="status" v-if="isLastMessage">
        {{ status }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .right {
    align-self: flex-end;
    text-align: end;
  }

  .author {
    color: var(--neutral);
  }

  .message {
    border-radius: 2rem;
    background-color: var(--bg-color-alt1);

    position: relative;
    padding: 0.5rem 0.75rem;
    width: max-content;

    display: grid;
    place-items: center;

    div {
      place-items: end;
    }
  }

  .bottom-data {
    color: var(--neutral);
    width: 90%;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  .self-controls {
    button {
      display: inline;
      margin-right: 0.5rem;
    }
  }


  .status {
    text-transform: capitalize;
    margin-right: 1rem;
  }
}
</style>
