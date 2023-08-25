<script lang="ts" setup>
import { UserReadTimes, type ConversationMessage } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()
const { message, userReadTimes } = defineProps<{ message: ConversationMessage, userReadTimes: UserReadTimes }>()
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
      {{ message.content }}
    </span>
    <span class="status right" v-if="isMine">
      <!-- TODO: Add tooltip, add pending indicator, add retry button, add, if successful, edit/delete buttons -->
      {{ status }}
    </span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;

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
    --r: 25px;
    --t: 30px;
    position: relative;
    padding: 0.5rem 0.75rem;
    width: max-content;
  }

  .status {
    text-transform: capitalize;
  }
}
</style>
