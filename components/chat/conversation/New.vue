<script setup lang="ts">
import { useUsersStore } from '@/stores/users'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

const { open } = defineProps<{ open: boolean }>()
const userStore = useUsersStore()

function handleSubmit() {
  //
}
</script>

<template>
  <BaseModal @close="$emit('close')" :open="open">
    <form @submit.prevent="handleSubmit" class="new">
      <!-- Multiselect & Autosize input -->
      <GeneralIconButton title="Send message" :icon="PaperAirplaneIcon" size="0.8rem" />
    </form>
  </BaseModal>
</template>

<style scoped>
.new {
  padding: 2rem;

  display: grid;
  place-items: center;
}
</style>
