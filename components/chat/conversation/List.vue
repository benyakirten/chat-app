<script lang="ts" setup>
const messageStore = useMessageStore()
const modalStore = useModalStore()
</script>

<template>
  <div class="conversation-list">
    <!-- TODO (future): Add filters -->
    <div class="conversation-list-conversations">
      <div v-if="messageStore.visibleConversations.length === 0" class="conversation-list-conversations-empty">
        No Conversations. Click below to start a new one.
      </div>
      <!--
        TODO: Virtualize the list - either hand rolled or use a library
        The backend will paginate the conversation list
        But this list will need to be virtualized on the frontend too
      -->
      <ul v-else>
        <ChatConversationItem
          v-for="conversation of messageStore.visibleConversations"
          :key="conversation.id"
          :conversation="conversation"
        />
      </ul>
    </div>
    <BaseButton class="conversation-list-new" @click="modalStore.newConversation()">
      Start a new conversation
    </BaseButton>
  </div>
</template>

<style scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  border-right: 1px solid var(--accent);

  &-conversations {
    flex-grow: 1;

    &-empty {
      font-size: var(--text-size-xl);
      padding: 1rem;
    }
  }

  &-new {
    text-align: center;
    padding: 1.5rem;
  }
}
</style>
