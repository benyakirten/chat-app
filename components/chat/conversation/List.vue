<script lang="ts" setup>
import { useMessageStore } from '@/stores/messages';

const store = useMessageStore()
</script>

<template>
  <div class="container">
    <div class="conversations">
      <div v-if="store.conversations.size === 0">
        No Conversations. Click below to start a new one.
      </div>
      <!--
        TODO: Virtualize the list - either hand rolled or use a library
        The backend will paginate the conversation list
        But this list will need to be virtualized on the frontend too
      -->
      <ul v-else>
        <ChatConversationItem v-for="[key, value] in store.conversations" :key="key" :conversation="value" />
      </ul>
    </div>
    <button>
      Start a new conversatin
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .conversations {
    flex-grow: 1;
  }

  ul {
    overflow: auto;
  }
}
</style>
