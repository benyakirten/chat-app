<script lang="ts" setup>
import { useMessageStore } from '@/stores/messages';

const store = useMessageStore()
</script>

<template>
  <div class="container">
    <!-- TODO (future): Add filters -->
    <div class="conversations">
      <div v-if="store.visibleConversations.length === 0">
        No Conversations. Click below to start a new one.
      </div>
      <!--
        TODO: Virtualize the list - either hand rolled or use a library
        The backend will paginate the conversation list
        But this list will need to be virtualized on the frontend too
      -->
      <ul v-else>
        <ChatConversationItem v-for="conversation in store.visibleConversations" :key="conversation.conversationId"
          :conversation-id="conversation.conversationId" />
      </ul>
    </div>
    <button class="new-conversation" disabled>
      Start a new conversation
    </button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  border-right: 1px solid var(--accent);

  .conversations {
    flex-grow: 1;
  }

  .new-conversation {
    cursor: pointer;
    width: 100%;
    padding: 0.5rem 0;
    text-align: center;

    transition: background-color var(--time-150) ease-in, color var(--time-150) ease-out;

    border-top: 1px solid var(--accent);

    &:hover {
      /* TODO: Improve colors/styles */
      color: var(--primary-text);
      background-color: var(--bg-color-alt4);
    }
  }
}
</style>
