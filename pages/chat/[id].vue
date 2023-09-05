<script lang="ts" setup>
import { useMessageStore } from '@/stores/messages';

definePageMeta({
  pageTransition: false,
})

const route = useRoute()
const messageStore = useMessageStore()
// TODO: Work on types here
const conversationId = computed(() => route.params['id'] as string)
onMounted(() => {
  messageStore.viewConversation(conversationId.value)
})
</script>

<template>
  <div>
    <!-- TODO: Figure out why this has to be wrapped in a div -->
    <ChatLayout>
      <ChatMessageList :conversation-id="conversationId" />
    </ChatLayout>
  </div>
</template>
