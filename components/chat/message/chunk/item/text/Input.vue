<script setup lang="ts">
const props = defineProps<{ content: string }>()
const messageStore = useMessageStore()
const message = ref(props.content)

function checkForSubmit(e: KeyboardEvent) {
  if (!e.shiftKey) {
    messageStore.editMessage(message.value)
  }
}
</script>

<template>
  <GeneralInputAutosize
    placeholder="Edit message..."
    label="Edit message"
    v-model="message"
    :autofocus="true"
    @keydown.esc="messageStore.stopMessageEdit"
    @keydown.enter="checkForSubmit"
  />
</template>
