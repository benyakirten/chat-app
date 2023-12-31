<script setup lang="ts">
const modalStore = useModalStore()

function focusCombobox() {
  const combobox = document.querySelector("input[role='combobox']")
  if (combobox instanceof HTMLInputElement) {
    combobox.focus()
  }
}
</script>

<template>
  <BaseModal
    :open="modalStore.state?.type === 'new' || modalStore.state?.type === 'modify'"
    :initial-focus-callback="focusCombobox"
  >
    <ChatConversationModalNew v-if="modalStore.state?.type === 'new'" />
    <ChatConversationModalModify
      v-else-if="modalStore.state?.type === 'modify'"
      :conversation-id="modalStore.state.id"
    />
  </BaseModal>
</template>
