<template>
  <BaseLayoutPage>
    <h1>Messages</h1>
    <div class="messages">
      <ChatConversationList />
      <slot></slot>
    </div>
  </BaseLayoutPage>
</template>

<style scoped>
h1 {
  text-align: center;
  padding-bottom: 1rem;
}

.messages {
  display: grid;
  grid-template-columns: 16rem 1fr;
  height: 65vh;
  margin: 1rem 0.5rem 0;
  margin-right: 2rem;
  border: 1px solid var(--accent);
  border-left: none;
}
</style>
