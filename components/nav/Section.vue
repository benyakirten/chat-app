<script lang="ts" setup>
import { LayoutState, useLayoutStore } from "@/stores/layout";

const layoutStore = useLayoutStore()
const { group, height, zIndex, backgroundColor, width } = defineProps<{
  group: LayoutState["sidebarTabOpened"]
  height: string
  zIndex: number
  backgroundColor: string
  width: string
}>()
</script>

<template>
  <!-- TODO: Add accessibility for expandable sections -->
  <div class="section">
    <div class="section-contents" :class="{ 'section-contents--open': layoutStore.isOpen(group) }">
      <button class="section-header" @click="layoutStore.toggleTabOpened(group)">
        <NavOpenIndicator :open="layoutStore.isOpen(group)" />
        <h4>
          {{ `${group?.charAt(0).toUpperCase()}${group?.slice(1)} ` }}
        </h4>
      </button>
      <Transition name="section-expand">
        <div class="section-body" v-if="layoutStore.isOpen(group)">
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
  --box-shadow: color-mix(in srgb, var(--accent) 25%, transparent);
  box-shadow: -7px 8px 6px -3px var(--box-shadow);
  transition: width var(--time-250) ease-in;
  z-index: v-bind(zIndex);

  &-header {
    cursor: pointer;

    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    align-items: center;

    outline: none;
    border: none;
    color: var(--primary-text);
    background-color: v-bind(backgroundColor);
    padding: 1rem;
    width: 100%;
    height: 100%;
  }

  &-body {
    padding-left: 1rem;
  }

  &-contents {
    transition: transform var(--time-250) ease-in;

    &--open {
      transition: padding-bottom var(--time-50) ease var(--time-200);
      padding-bottom: 1rem;
    }
  }

  &:hover {
    /* TODO: Figure out how to do this with scaleX and not width */
    width: calc(v-bind(width) * 1.05);
  }
}

.section-expand-enter-active,
.section-expand-leave-active {
  transition: height var(--time-250) ease-in-out, opacity var(--time-100) ease-in-out var(--time-50);
  height: v-bind(height);
  opacity: 1;
}



.section-expand-enter-from,
.section-expand-leave-to {
  height: 0px;
  opacity: 0;
}
</style>
