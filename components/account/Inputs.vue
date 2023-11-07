<script setup lang="ts">
defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <AccountInputsMagnification :magnification="me.magnification" />
  <AccountInputsTheme :theme="me.theme" />
  <AccountInputsUserName :name="profile.name" />
  <AccountInputsHidden :hidden="me.hidden" />
</template>

<style scoped>
.label {
  font-size: var(--text-size-xl);
  padding-bottom: 1rem;
}

.item {
  color: var(--text-color);
  font-size: var(--text-size-xl);

  display: flex;
  padding-inline: 1rem;
  padding-block: 0.4rem;
  align-items: center;
}
</style>
