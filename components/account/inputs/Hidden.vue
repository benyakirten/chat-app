<script setup lang="ts">
const props = defineProps<{ hidden: boolean }>()
const userStore = useUsersStore()

const isHidden = ref(props.hidden)
</script>

<template>
  <GeneralInputCheckbox class="hidden" :model-value="isHidden" @update:model-value="userStore.setHidden($event)">
    Do not let other users know when you log in:
  </GeneralInputCheckbox>
</template>

<style scoped>
.hidden {
  height: 100%;
  align-items: end;
  padding-bottom: 0.5rem;
}
</style>
