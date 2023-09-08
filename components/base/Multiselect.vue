<script lang="ts" setup generic="T extends { id: string }">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { v4 as uuid } from 'uuid'

defineOptions({ inheritAttrs: false })

const { id, title, options } = withDefaults(defineProps<{ id?: string; title: string; options: T[] }>(), { id: uuid() })
const isOpen = ref(false)
const withId = computed(() => (name: string) => `${id}-${name}`)
</script>

<template>
  <label :for="withId('input')">
    <slot name="label">
      {{ title }}
    </slot>
  </label>
  <div class="combobox combobox-list">
    <div class="combobox-group">
      <input
        type="text"
        role="combobox"
        class="combobox-edit"
        aria-autocomplete="both"
        :aria-expanded="isOpen"
        :aria-controls="withId('listbox')"
      />
      <button
        class="combobox-button"
        :class="{ invert: isOpen }"
        :id="withId('button')"
        :aria-label="title"
        :aria-expanded="isOpen"
        :aria-controls="withId('listbox')"
        tabindex="-1"
      >
        <ChevronDownIcon aria-hidden="true" />
      </button>
    </div>
    <ul :id="withId('listbox')" role="listbox" :aria-label="title">
      <li v-for="option of options" :key="option.id" :id="withId(option.id)" role="option">
        <slot name="item" :item="option"></slot>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combobox {
  &-list {
    position: relative;
  }
}
</style>
