<script lang="ts" setup>
const layoutStore = useLayoutStore()
const props = defineProps<{
  group: LayoutState['sidebarTabOpened']
  height: string
  zIndex: number
  backgroundColor: string
  width: string
}>()
const isOpen = computed(() => layoutStore.isOpen(props.group))
const id = computed(() => `${props.group}-expadable-content`)
</script>

<template>
  <div class="section">
    <div class="section-contents">
      <button
        :aria-controls="id"
        :aria-expanded="isOpen"
        class="section-header"
        @click="layoutStore.toggleTabOpened(group)"
      >
        <NavOpenIndicator :open="isOpen" />
        <h4>{{ group }}</h4>
      </button>
      <Transition name="section-expand">
        <div :id="id" class="section-body" v-if="isOpen">
          <slot></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.section {
  width: v-bind(width);
  background-color: v-bind(backgroundColor);
  box-shadow: -7px 8px 6px -3px var(--box-shadow-color);
  transition: width 250ms ease-in;
  z-index: v-bind(zIndex);
  padding: 1rem;

  &-header {
    cursor: pointer;

    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    align-items: center;

    outline: none;
    border: none;
    color: var(--text-color);
    background-color: inherit;
    width: 100%;
    height: 100%;
    padding: 0.5rem 0;

    h4 {
      font-size: var(--text-size-xxl);
      text-transform: capitalize;
    }
  }

  &-body {
    padding-left: 1rem;
    height: v-bind(height);
  }

  &-contents {
    transition: transform 250ms ease-in;
  }

  &:hover {
    width: calc(v-bind(width) * 1.05);
  }
}

.section-expand-enter-active {
  transition: height 400ms ease-in-out, opacity 100ms ease-in-out 150ms;
  height: v-bind(height);
  opacity: 1;
}

.section-expand-leave-active {
  transition: height 250ms ease-in-out;
  height: v-bind(height);
  opacity: 1;
}

.section-expand-enter-from,
.section-expand-leave-to {
  height: 0px;
  opacity: 0;
}
</style>
