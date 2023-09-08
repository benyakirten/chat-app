<script lang="ts" setup generic="T extends { id: string }">
import { v4 as uuid } from 'uuid'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'

defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ (e: 'select', id: string): void; (e: 'deselect', id: string): void }>()

const props = withDefaults(
  defineProps<{
    title: string
    id?: string
    options: T[]
    selected: Set<string>
    placeholder: string
    iconSize?: string
    maxHeight?: string
    search: (item: T, text: string) => boolean
    searchCallback?: (text: string) => Promise<void> | void
  }>(),
  { iconSize: '0.8rem', maxHeight: '8rem', id: uuid() }
)

const isOpen = ref(false)
const combobox = ref<HTMLElement | null>(null)
const listbox = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLLIElement[]>([])
const text = ref('')
const isSearching = ref(false)
const { clear, debouncer } = useDebounce(async (value) => {
  isSearching.value = true
  await props.searchCallback?.(value)
  isSearching.value = false
})
const withId = (name: string) => `${props.id}-${name}`
const shownOptions = computed(() =>
  text.value === '' ? props.options : props.options.filter((option) => props.search(option, text.value))
)
const focusIdx = ref(-1)
const activeDescendant = computed(() =>
  focusIdx.value === -1 || focusIdx.value > shownOptions.value.length - 1
    ? undefined
    : shownOptions.value[focusIdx.value].id
)

function handleOptionClick(id: string) {
  combobox.value?.focus()
  toggleItem(id)
}

function close() {
  isOpen.value = false
  focusIdx.value = -1
}

function getNextIndex() {
  if (focusIdx.value === shownOptions.value.length - 1) {
    return 0
  }

  return focusIdx.value + 1
}

function getLastIndex() {
  if (focusIdx.value === 0) {
    return shownOptions.value.length - 1
  }

  return focusIdx.value - 1
}

function toggleItem(id?: string) {
  if (!id) {
    return
  }

  if (props.selected.has(id)) {
    emit('deselect', id)
    return
  }

  emit('select', id)
}

// If the text box is cleared, do not perform an async search
watch(text, (val) => val === '' && clear())

// TODO: Clean this up
function handleComboboxKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      isOpen.value = true

      if (!e.altKey) {
        const idx = getNextIndex()
        focusIdx.value = idx
        itemRefs.value[idx]?.scrollIntoView({ behavior: 'smooth' })
      }

      return
    case 'ArrowUp':
      isOpen.value = true

      if (!e.altKey) {
        const idx = getLastIndex()
        focusIdx.value = idx
        itemRefs.value[idx]?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    case 'Escape':
      if (isOpen.value) {
        close()
      } else {
        text.value = ''
      }

      return
    case 'Enter':
      if (focusIdx.value === -1) {
        return
      } else {
        toggleItem(shownOptions.value[focusIdx.value]?.id)
      }
      return
    default:
      return
  }
}

function alternateOpen() {
  if (isOpen.value) {
    close()
    return
  }
  isOpen.value = true
}

onMounted(() => {
  const clickListener = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) {
      return
    }

    if (listbox.value?.contains(e.target) || combobox.value?.contains(e.target)) {
      return
    }

    isOpen.value = false
  }

  window.addEventListener('click', clickListener)
  return () => window.removeEventListener('click', clickListener)
})
</script>

<template>
  <label class="label" :for="withId('input')">
    <slot name="label">
      {{ title }}
    </slot>
  </label>
  <div class="combobox" v-bind="$attrs">
    <div class="combobox-group">
      <div class="combobox-group-input">
        <input
          type="text"
          role="combobox"
          v-model="text"
          ref="combobox"
          aria-autocomplete="list"
          :id="withId('input')"
          :placeholder="placeholder"
          :aria-expanded="isOpen"
          :aria-controls="withId('listbox')"
          :aria-activedescendant="activeDescendant"
          @keydown="handleComboboxKeydown"
          @focus="isOpen = true"
          @input="props.searchCallback && text.trim() && debouncer(text)"
        />
        <div v-if="isSearching" class="combobox-group-input-loading">
          <GeneralLoading size="1.6rem" />
        </div>
      </div>
      <button
        class="combobox-group-button"
        :id="withId('button')"
        :aria-label="title"
        :aria-expanded="isOpen"
        :aria-controls="withId('listbox')"
        @click="alternateOpen"
        tabindex="-1"
      >
        <ChevronDownIcon aria-hidden="true" />
      </button>
    </div>
    <ul
      class="listbox"
      ref="listbox"
      :style="{ display: isOpen ? 'block' : 'none' }"
      :id="withId('listbox')"
      role="listbox"
      :aria-label="title"
      aria-multiselectable="true"
    >
      <li v-if="shownOptions.length === 0">No available options</li>
      <TransitionGroup v-else name="item-list">
        <li
          v-for="(option, i) of shownOptions"
          :key="option.id"
          class="listbox-item"
          role="option"
          :id="option.id"
          :aria-selected="focusIdx === i"
          ref="itemRefs"
          @click="handleOptionClick(option.id)"
        >
          <div class="listbox-item-left">
            <slot name="item" :item="option"></slot>
          </div>
          <div class="listbox-item-right" v-if="selected.has(option.id)">
            <CheckIcon aria-hidden="true" />
          </div>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>

<style scoped>
label {
  /*  */
  color: currentColor;
}
.combobox {
  position: relative;
  /* TODO: Revisit this */
  width: min-content;

  &-group {
    display: inline-flex;
    cursor: pointer;
    border: 1px solid gray;

    &:hover,
    &[aria-expanded='true'] {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    &-input {
      --padding-right: 0.5rem;
      position: relative;
      padding-right: var(--padding-right);

      input {
        background-color: var(--bg-color-primary);
        color: var(--primary-text);
        outline: none;
        padding: 0.5rem;
        flex: 1;
        border: none;

        &::placeholder {
          opacity: 0.8;
        }
      }

      &-loading {
        position: absolute;
        right: var(--padding-right);
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &-button {
      background-color: var(--bg-color-primary);
      color: var(--primary-text);
      border-left: 1px solid gray;
      position: relative;
      cursor: pointer;
      width: 2rem;
      color: rgb(0 90 156);

      svg {
        forced-color-adjust: auto;
        transition: rotate var(--time-200) ease;
      }

      &[aria-expanded='true'] > svg {
        rotate: 180deg;
      }
    }
  }
}

.listbox {
  position: absolute;
  width: 100%;
  top: calc(100% + 0.2rem);
  left: 0;
  background-color: var(--bg-color-primary);

  border: 2px currentcolor solid;
  max-height: v-bind(maxHeight);

  overflow-y: auto;
  overflow-x: hidden;
  cursor: pointer;

  &-item {
    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr 2rem;

    &[aria-selected='true'],
    &:hover {
      background-color: var(--bg-color-alt4);
    }

    &-left {
      grid-column: 1 / 2;
    }

    &-right {
      grid-column: 2 / -1;
      display: grid;
      place-items: center;
      height: v-bind(iconSize);
      width: v-bind(iconSize);
    }
  }
}

/*
  TODO: Adjust styles
*/
.item-list-move,
.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.5s ease;
}

.item-list-enter-from,
.item-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.item-list-leave-active {
  position: absolute;
}
</style>