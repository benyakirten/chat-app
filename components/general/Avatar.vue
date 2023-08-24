<script lang="ts" setup>
import { User } from '@/stores/users';

const { users, size } = withDefaults(defineProps<{ users: User[], size?: string }>(), {
  size: "1.5rem",
})
</script>

<template>
  <!-- TODO: What will the avatar show in a group conversation? -->
  <!-- TODO: Update the no image found with a better thing - SVG at the least -->
  <!-- TODO: Work on CSS -->
  <div class="avatar">
    <span>?</span>
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
