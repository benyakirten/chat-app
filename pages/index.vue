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
  <BaseLayoutPage>
    <h1>Messages</h1>
    <div class="messages">
      <div class="messages-conversations">
        <ChatConversationList />
      </div>
      <div class="messages-current">
        <ChatMessageList />
      </div>
    </div>
  </BaseLayoutPage>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.messages {
  display: grid;
  grid-template-columns: 20rem 1fr;

  &-conversations {
    /*  */
  }

  &-current {
    /*  */
  }
}
</style>
