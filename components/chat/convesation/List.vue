<script lang="ts" setup>
import { useMessageStore } from '@/stores/messages';

const store = useMessageStore()
</script>

<template>
  <div class="container">
    <div v-if="store.conversations.size === 0">
      No Conversations
    </div>
    <!--
      TODO: Virtualize the list - either hand rolled or use a library
      The backend will paginate the conversation list
      But this list will need to be virtualized on the frontend too
    -->
    <ul v-else>
      <ChatConversationItem v-for="[key, value] in store.conversations" :key="key" :conversation="value" />
    </ul>
    <button>
      Start a new conversatin
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  ul {
    overflow: auto;
  }
}
</style>
