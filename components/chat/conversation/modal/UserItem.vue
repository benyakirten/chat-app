<script setup lang="ts">
import { User } from '@/stores/users'

defineProps<{ user: User }>()
</script>

<template>
  <div class="user">
    <div class="user-avatar">
      <GeneralAvatar :user-id="user.id" />
    </div>
    <span class="user-name">{{ user.name }}</span>
  </div>
</template>

<style scoped>
.user {
  &-avatar {
    /*  */
  }

  &-name {
    /*  */
  }
}
</style>
