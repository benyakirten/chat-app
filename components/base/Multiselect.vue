<script lang="ts" setup generic="T extends { id: string }">
import { v4 as uuid } from 'uuid'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'

// TODO: Make this work for either single select or multiselect
const emit = defineEmits<{ (e: 'update:modelValue', value: Set<string>): void }>()

const props = withDefaults(
  defineProps<{
    title: string
    id?: string
    options: T[]
    modelValue: Set<string>
    placeholder: string
    iconSize?: string
    maxHeight?: string
    type?: 'multi' | 'single'
    search: (item: T, text: string) => boolean
    searchCallback?: (text: string) => Promise<void> | void
  }>(),
  { iconSize: '0.8rem', maxHeight: '8rem', id: uuid(), type: 'multi' }
)

const combobox = ref<HTMLElement | null>(null)
const listbox = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLLIElement[]>([])

const isOpen = ref(false)
const text = ref('')

const { loading, invoke } = useLoading(async (value: string) => props.searchCallback?.(value))
const { clear, debouncer } = useDebounce(async (value: string) => props.searchCallback && invoke(value))

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

function toggleItem(id?: string) {
  if (!id) {
    return
  }

  if (props.type === 'multi') {
    props.modelValue.has(id) ? props.modelValue.delete(id) : props.modelValue.add(id)
    emit('update:modelValue', props.modelValue)
    text.value = ''
    return
  }

  emit('update:modelValue', new Set([id]))
  close()
}

function handleArrow(direction: 1 | -1, altKey: boolean) {
  isOpen.value = true

  if (altKey) {
    return
  }

  const idx = mod(focusIdx.value + direction, shownOptions.value.length)
  focusIdx.value = idx
  itemRefs.value[idx].scrollIntoView({ behavior: 'smooth' })
}

// If the text box is cleared, do not perform an async search
watch(text, (val) => val === '' && clear())

// TODO: Clean this up
function handleComboboxKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      handleArrow(1, e.altKey)
      return
    case 'ArrowUp':
      handleArrow(-1, e.altKey)
      return
    case 'Escape':
      if (isOpen.value) {
        close()
        return
      }
      text.value = ''

      return
    case 'Enter':
      if (focusIdx.value === -1) {
        return
      }
      toggleItem(shownOptions.value[focusIdx.value]?.id)

      return
    default:
      return
  }
}

const alternateOpen = () => {
  if (isOpen.value) {
    close()
    return
  }

  isOpen.value = true
  combobox.value?.focus()
}

const backdropClickDetector = (e: MouseEvent) => {
  if (!(e.target instanceof HTMLElement)) {
    return
  }

  if (listbox.value?.contains(e.target) || combobox.value?.contains(e.target)) {
    return
  }

  isOpen.value = false
}

useAddMountedEventCallback('click', backdropClickDetector)
</script>

<template>
  <div>
    <label class="label" :for="withId('input')">
      <slot name="label">
        {{ title }}
      </slot>
    </label>
    <div class="combobox">
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
            @click="alternateOpen"
          />
          <div v-if="loading" class="combobox-group-input-loading">
            <GeneralLoading size="1.6rem" />
          </div>
        </div>
        <button
          type="button"
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
        <li class="listbox-item" v-if="shownOptions.length === 0">
          <slot name="no-options"> No available options </slot>
        </li>
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
          <div class="listbox-item-right" v-if="modelValue.has(option.id)">
            <div class="listbox-item-right-icon">
              <CheckIcon aria-hidden="true" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
label {
  color: currentColor;
}
.combobox {
  position: relative;
  isolation: isolate;
  z-index: var(--z-high);
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
      position: relative;
      padding-right: var(--padding-right);

      input {
        background-color: var(--bg-primary);
        color: var(--text);
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
      background-color: var(--bg-primary);
      color: var(--text);
      border-left: 1px solid gray;
      position: relative;
      cursor: pointer;
      width: 2rem;
      color: rgb(0 90 156);

      svg {
        forced-color-adjust: auto;
        transition: rotate 200ms ease;
      }

      &[aria-expanded='true'] > svg {
        rotate: 180deg;
      }
    }
  }
}

.listbox {
  z-index: 2;
  position: absolute;
  width: 100%;
  top: calc(100% + 0.2rem);
  left: 0;
  background-color: var(--bg-primary);

  border: 2px currentcolor solid;
  max-height: v-bind(maxHeight);

  overflow-y: auto;
  overflow-x: hidden;
  cursor: pointer;

  &-item {
    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr 3rem;
    height: 2rem;

    &[aria-selected='true'],
    &:hover {
      background-color: var(--bg-alt4);
    }

    &-left {
      grid-column: 1 / 2;
    }

    &-right {
      width: 100%;
      height: 100%;
      grid-column: 2 / -1;
      display: grid;
      place-items: center;

      &-icon {
        height: v-bind(iconSize);
        width: v-bind(iconSize);
      }
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
