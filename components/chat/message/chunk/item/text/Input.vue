<script setup lang="ts">
import { useMessageStore } from '@/stores/messages';

const { content } = defineProps<{ content: string }>()
const messageStore = useMessageStore()
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <!-- TODO: Make the transition less jarring -->
  <GeneralInputAutosize
    placeholder="Edit message..."
    label="Edit message"
    :value="content"
    @cancel="messageStore.stopMessageEdit()"
    @submit="messageStore.editMessage($event)"
  />
</template>
