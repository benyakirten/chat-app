<script setup lang="ts">
defineEmits<{
  (e: 'resend'): void
}>()
const props = defineProps<{
  isMine: boolean
  readList: string[]
  isPrivate: boolean
  createTime: Date
  updateTime: Date
  status: ConversationMessage['status']
  align: 'right' | 'left'
  isEditing: boolean
}>()
</script>

<template>
  <div class="status">
    <ChatMessageChunkItemStatusEditing v-if="isEditing" />
    <ChatMessageChunkItemStatusError @resend="$emit('resend')" v-else-if="isMine && status === 'error'" />
    <ChatMessageChunkItemStatusLoading v-else-if="isMine && status === 'pending'" />
    <ChatMessageChunkItemStatusNormal v-else v-bind="props" />
  </div>
</template>

<style scoped>
.status {
  width: 100%;
  text-align: v-bind(align);
  font-size: var(--size-sm);
}
</style>
