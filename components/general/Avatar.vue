<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/solid'

const userStore = useUsersStore()
const props = withDefaults(defineProps<{ userId: UserId; size?: string; showOnlineIndicator?: boolean }>(), {
  size: '1.8rem',
  showOnlineIndicator: true,
})
const user = computed(() => userStore.users.get(props.userId))
const name = computed(() => user.value?.name ?? 'Unknown User')
</script>

<template>
  <div class="avatar">
    <img v-if="user?.image" :src="user.image" :alt="name" />
    <UserIcon v-else :aria-label="name" />
    <GeneralTooltip class="indicator-container" v-if="showOnlineIndicator">
      <template #content> Status: {{ user?.online ? 'Online' : 'Offline' }} </template>
      <div class="avatar-indicator" :class="{ online: user?.online }"></div>
    </GeneralTooltip>
  </div>
</template>

<style scoped>
.indicator-container {
  width: 100%;
  height: 100%;
}

.avatar {
  position: relative;
  align-self: center;
  display: grid;
  place-items: center;

  width: v-bind(size);
  height: v-bind(size);

  border-radius: var(--rounded);
  border: 1px solid var(--text-color);

  &-indicator {
    --indicator-bg: var(--error-bg);
    --outside-color: color-mix(in srgb, var(--indicator-bg) 50%, var(--white));
    --inside-color: color-mix(in srgb, var(--indicator-bg) 80%, var(--black));

    --indicator-size: max(0.6rem, calc(v-bind(size) / 4));
    --indicator-offset: calc(var(--indicator-size) / -8);

    position: absolute;
    right: var(--indicator-offset);
    bottom: var(--indicator-offset);

    border-radius: var(--rounded);

    height: var(--indicator-size);
    width: var(--indicator-size);

    background: radial-gradient(circle at 30% 30%, var(--inside-color), var(--indicator-bg), var(--outside-color));

    &.online {
      --indicator-bg: var(--success-bg);
    }
  }
}
</style>
