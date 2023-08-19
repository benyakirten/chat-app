<script lang="ts" setup>
import { v4 as uuid } from "uuid";

const { value, id } = withDefaults(
  defineProps<{ id?: string, value?: string }>(), { id: uuid() }
)
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

function handleChange(e: Event) {
  if (!e.target || !("value" in e.target) || typeof e.target.value !== "string") {
    return
  }
  emit('change', e.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" :value="value" :id="id" />
</template>

<style scoped>
input {}
</style>
