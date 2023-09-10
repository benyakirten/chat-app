<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/solid'

import type { UserId } from '@/stores/messages'

const userStore = useUsersStore()
const { userId, size } = withDefaults(defineProps<{ userId: UserId; size?: string }>(), {
  size: '1.5rem',
})
const user = computed(() => userStore.users.get(userId))
</script>

<template>
  <!-- TODO: What will the avatar show in a group conversation? -->
  <!-- TODO: Update the no image found with a better thing - SVG at the least -->
  <!-- TODO: Work on CSS -->
  <div class="avatar">
    <img v-if="user?.image" :src="user.image" :alt="user.name" />
    <UserIcon v-else :aria-label="user?.name ?? 'Unknown User'" />
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  align-self: center;
  display: grid;
  place-items: center;

  width: v-bind(size);
  height: v-bind(size);

  border-radius: 9999px;
  border: 1px solid var(--secondary-text);

  span {
    font-size: 0.8rem;
  }
}
</style>
