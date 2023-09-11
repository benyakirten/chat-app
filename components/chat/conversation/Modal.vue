<script setup lang="ts">
defineProps<{ modalOpen: 'new' | 'modify' | null; conversationId: ConversationId | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <BaseModal @close="emit('close')" :open="modalOpen !== null">
    <ChatConversationModalNew @close="emit('close')" v-if="modalOpen === 'new'" />
    <ChatConversationModalModify @close="emit('close')" v-else :conversation-id="conversationId" />
  </BaseModal>
</template>
