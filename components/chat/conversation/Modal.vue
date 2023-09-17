<script setup lang="ts">
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()

function focusCombobox() {
  const combobox = document.querySelector("input[role='combobox']")
  if (combobox instanceof HTMLInputElement) {
    combobox.focus()
  }
}
</script>

<template>
  <ClientOnly>
    <BaseModal :open="modalStore.state !== null" :initial-focus-callback="focusCombobox">
      <ChatConversationModalNew v-if="modalStore.state?.type === 'new'" />
      <ChatConversationModalModify
        v-else-if="modalStore.state?.type === 'modify'"
        :conversation-id="modalStore.state.id"
      />
    </BaseModal>
  </ClientOnly>
</template>
