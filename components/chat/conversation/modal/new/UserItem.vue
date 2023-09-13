<script setup lang="ts">
defineProps<{ user: User }>()
</script>

<template>
  <div class="user">
    <span class="user-avatar">
      <GeneralAvatar :user-id="user.id" />
    </span>
    <span class="user-name">{{ user.name }}</span>
  </div>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem;
}
</style>
