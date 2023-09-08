<script lang="ts" setup generic="T extends { id: string }">
import { v4 as uuid } from 'uuid'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'

defineOptions({ inheritAttrs: false })

const { id, title, options, selected } = withDefaults(
  defineProps<{ id?: string; title: string; options: Map<T['id'], T>; selected: Set<string> }>(),
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
      <li class="listbox-item" v-for="[id, option] of options" :key="id" :id="withId(id)" role="option">
        <div class="listbox-item-left">
          <slot name="item" :item="option"></slot>
        </div>
        <div class="listbox-item-right" v-if="selected.has(id)">
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
    grid-template-columns: 1fr 2rem;

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
