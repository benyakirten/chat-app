<script lang="ts" setup>
import { type ConversationMessage } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const store = useUsersStore()
const { message } = defineProps<{ message: ConversationMessage }>()
const isMine = computed(() => store.isMine(message))

</script>

<template>
  <div class="container" :class="{ right: isMine }">
    <!-- TODO: Upgrade this styling -->
    <span class="author" :class="{ right: isMine }">
      From {{ isMine ? 'Me' : store.users.get(message.sender)?.name ?? "Unknown" }}
    </span>
    <span class="message" :class="isMine ? 'message-right' : 'message-left'">
      {{ message.content }}
    </span>
    <span class="time" :class="{ right: isMine }">
      {{ new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(message.createTime) }}
    </span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;

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

    &-left {
      /*  */
    }

    &-right {
      /*  */
    }
  }
}
</style>
