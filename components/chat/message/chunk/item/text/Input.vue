<script setup lang="ts">
const { content } = defineProps<{ content: string }>()
const messageStore = useMessageStore()
const message = ref(content)
</script>

<template>
  <!-- TODO: Should we maintain a partially completed message per conversation? -->
  <!-- TODO: Make the transition less jarring -->
  <GeneralInputAutosize
    placeholder="Edit message..."
    label="Edit message"
    v-model="message"
    :autofocus="true"
    @cancel="messageStore.stopMessageEdit()"
    @submit="messageStore.editMessage($event)"
  />
</template>
