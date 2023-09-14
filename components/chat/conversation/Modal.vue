<script setup lang="ts">
defineProps<{ modalOpen: 'new' | 'modify' | null; conversationId: ConversationId | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

function focusCombobox() {
  const combobox = document.querySelector("input[role='combobox']")
  if (combobox instanceof HTMLInputElement) {
    combobox.focus()
  }
}
</script>

<template>
  <BaseModal @close="emit('close')" :open="modalOpen !== null" :initial-focus-callback="focusCombobox">
    <ChatConversationModalNew @close="emit('close')" v-if="modalOpen === 'new'" />
    <ChatConversationModalModify @close="emit('close')" v-else :conversation-id="conversationId" />
  </BaseModal>
</template>
