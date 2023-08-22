<script lang="ts" setup>
import type { Conversation } from '@/stores/messages';

const { conversation } = defineProps<{ conversation: Conversation }>()
</script>

<template>
  <li>
    Converation with {{ conversation.members.size }} people
  </li>
</template>
