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
    <div class="container-conversations">
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
    <BaseButton class="container-new" @click="modalOpen = 'new'">Start a new conversation</BaseButton>
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

  &-conversations {
    flex-grow: 1;
  }

  &-new {
    text-align: center;
    padding: 1.5rem;
  }
}
</style>
