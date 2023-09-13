<script lang="ts" setup>
const messageStore = useMessageStore()

const modalOpen = ref<'new' | 'modify' | null>(null)
const conversationToModify = ref<ConversationId | null>(null)

function modifyConversation(id: ConversationId) {
  modalOpen.value = 'modify'
  conversationToModify.value = id
}

function closeModal() {
  modalOpen.value = null
  conversationToModify.value = null
}
</script>

<template>
  <div class="container">
    <!-- TODO (future): Add filters -->
    <div class="conversations">
      <div v-if="messageStore.visibleConversations.length === 0">No Conversations. Click below to start a new one.</div>
      <!--
        TODO: Virtualize the list - either hand rolled or use a library
        The backend will paginate the conversation list
        But this list will need to be virtualized on the frontend too
      -->
      <ul v-else>
        <ChatConversationItem
          v-for="conversation in messageStore.visibleConversations"
          :key="conversation.id"
          :conversation-id="conversation.id"
          @modify="modifyConversation(conversation.id)"
        />
      </ul>
    </div>
    <button class="new-conversation" @click="modalOpen = 'new'">Start a new conversation</button>
    <ChatConversationModal :modal-open="modalOpen" :conversation-id="conversationToModify" @close="closeModal" />
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

    transition: background-color 150ms ease-in, color 150ms ease-out;

    border-top: 1px solid var(--accent);

    &:hover {
      /* TODO: Improve colors/styles */
      color: var(--text);
      background-color: var(--bg-alt4);
    }
  }
}
</style>
