<script setup lang="ts">
defineProps<{ id?: ConversationId }>()

const mediaStore = useMediaStore()
</script>

<template>
  <BasePage>
    <ClientOnly>
      <template #fallback>
        <div class="fallback">
          <div class="fallback-container">
            <span>Loading content...</span>
            <GeneralLoading size="4rem" />
          </div>
        </div>
      </template>
      <ChatDesktopLayout v-if="mediaStore.state === 'desktop'" :id="id" />
      <ChatMobileLayout v-else :id="id" />
    </ClientOnly>
    <ChatConversationModal />
  </BasePage>
</template>

<style scoped>
.fallback {
  margin-top: 20rem;
  display: grid;
  place-items: center;

  &-container {
    display: flex;
    align-items: center;
  }
}
</style>
