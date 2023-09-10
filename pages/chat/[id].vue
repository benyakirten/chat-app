<script lang="ts" setup>
definePageMeta({
  pageTransition: false,
})

const route = useRoute()
const messageStore = useMessageStore()
// TODO: Work on types here
const id = computed(() => route.params['id'] as string)

// If the window was hidden then became visible then we want to say the user has viewed the current conversation
function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && id.value) {
    messageStore.viewConversation(id.value)
  }
}

useAddMountedEventCallback('visibilitychange', handleVisibilityChange)
onMounted(() => {
  messageStore.viewConversation(id.value)
})
</script>

<template>
  <div>
    <!-- TODO: Figure out why this has to be wrapped in a div -->
    <ChatLayout>
      <ChatMessageList :conversation-id="id" />
    </ChatLayout>
  </div>
</template>
