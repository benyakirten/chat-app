<script lang="ts" setup generic="T extends { id: string }">
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'
import { v4 as uuid } from 'uuid'

defineOptions({ inheritAttrs: false })

const { id, title, options, selected } = withDefaults(
  defineProps<{ id?: string; title: string; options: T[]; selected: Set<string> }>(),
  { id: uuid() }
)
const isOpen = ref(false)
const withId = computed(() => (name: string) => `${id}-${name}`)
</script>

<template>
  <label :for="withId('input')">
    <slot name="label">
      {{ title }}
    </slot>
  </label>
  <div class="combobox" v-bind="$attrs">
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
    <ul class="listbox" :id="withId('listbox')" role="listbox" :aria-label="title">
      <li class="listbox-item" v-for="option of options" :key="option.id" :id="withId(option.id)" role="option">
        <div class="listbox-item-left">
          <slot name="item" :item="option"></slot>
        </div>
        <div class="listbox-item-right" v-if="selected.has(option.id)">
          <CheckIcon aria-hidden="true" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combobox {
  position: relative;
}

.listbox {
  &-item {
    display: grid;
    grid-auto-columns: 1fr 2rem;

    &-left {
      grid-column: 1 / 2;
    }

    &-right {
      grid-column: 2 / -1;
      display: grid;
      place-items: center;
    }
  }
}
</style>
