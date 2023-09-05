<script setup lang="ts">
import { useMessageStore } from '@/stores/messages';

const { content } = defineProps<{ content: string }>()
const messageStore = useMessageStore()
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <GeneralInputAutosize
    placeholder="Edit message..."
    label="Edit message"
    :value="content"
    @cancel="messageStore.stopMessageEdit()"
  />
</template>
