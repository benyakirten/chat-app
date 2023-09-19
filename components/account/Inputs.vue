<script setup lang="ts">
defineProps<{ me: Me; profile: User }>()
</script>

<template>
  <AccountInputsMagnification :magnification="me.textSizeMagnification" />
  <AccountInputsTheme :theme="me.colorTheme" />
  <AccountInputsUserName :name="profile.name" />
</template>

<style scoped>
.label {
  font-size: var(--text-xl);
  padding-bottom: 1rem;
}

.item {
  color: var(--text);
  font-size: var(--text-xl);

  display: flex;
  padding-inline: 1rem;
  padding-block: 0.4rem;
  align-items: center;
}
</style>
