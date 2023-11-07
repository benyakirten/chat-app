<script lang="ts" setup>
definePageMeta({
  pageTransition: false,
})

const route = useRoute()
const messageStore = useMessageStore()
const socketStore = useSocketStore()
// TODO: Work on types here
const id = toRef(route.params['id'] as string)

// If the window was hidden then became visible then we want to say the user has viewed the current conversation
function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && id.value) {
    socketStore.transmitConversationRead(id.value)
  }
}

useAddMountedEventCallback('visibilitychange', handleVisibilityChange)
onMounted(() => {
  socketStore.transmitConversationRead(id.value)
})
</script>

<template>
  <ChatLayout :id="id" />
</template>
