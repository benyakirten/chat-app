<script lang="ts" setup>
import { type ConversationMessage } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const store = useUsersStore()
const { message } = defineProps<{ message: ConversationMessage }>()
</script>

<template>
  <div :class="{ right: store.isMine(message) }">
    <!-- TODO: Upgrade this styling -->
    <button class="my-message" v-if="store.isMine(message)">
      {{ message.content }}
    </button>
    <span class="other-message" v-else>
      {{ message.content }}
    </span>
  </div>
</template>

<style scoped>
.right {
  align-self: flex-end;
}

.other-message {
  align-self: flex-start;
}
</style>
