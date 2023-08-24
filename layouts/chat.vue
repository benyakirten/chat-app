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
  column-gap: 2rem;
  height: 65vh;
}
</style>
