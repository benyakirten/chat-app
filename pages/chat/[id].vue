<script lang="ts" setup>
const route = useRoute()
// TODO: Work on types here
const conversationId = computed(() => route.params["id"] as string)
</script>

<template>
  <!--
    In desktop - 2 columns:
    1. all conversations
    2. messages in active conversation

    In mobile these become 2 pages with the ability to go back from one to the next
    Maybe in mobile hide active conversation if on choosing conversation mode and the opposite?
    Maybe don't hide but just scroll different positions into view?
  -->
  <!-- TODO: Determine how to virtualize lists -->
  <!-- TODO: Determine how to start a conversation if you would like to create one -->
  <NuxtLayout name="chat">
    <ChatMessageList :conversationId="conversationId" />
  </NuxtLayout>
</template>
