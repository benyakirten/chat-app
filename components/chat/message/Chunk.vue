<script lang="ts" setup>
import type { ConversationMessage, UserReadTimes } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()
const { chunk, userReadTimes } = defineProps<{ chunk: ConversationMessage[], userReadTimes: UserReadTimes }>()
const userId = computed(() => chunk[0].sender)
const isMine = computed(() => userStore.isMine(chunk[0]))
const flexDirection = computed(() => isMine.value ? 'row' : 'row-reverse')
</script>

<template>
  <div class="message-group" :class="{ right: isMine }">
    <div class="messages">
      <ChatMessageChunkItem v-for="(message, i) in chunk" :read-times="userReadTimes" :message="message" :is-mine="isMine"
        :is-first="i === 0" :is-last="i === chunk.length - 1" />
    </div>
    <div class="avatar">
      <GeneralAvatar :user-id="userId" />
    </div>
  </div>
</template>

<style scoped>
.message-group {
  display: flex;
  gap: 1rem;
  flex-direction: v-bind(flexDirection);
}

.avatar {
  align-self: end;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.right {
  align-self: flex-end;
}
</style>
