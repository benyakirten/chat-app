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
  <div class="section" @mouseenter="layoutStore.setTabOpened(group)" @mouseleave="layoutStore.setTabOpened(null)">
    <div class="section-contents">
      <div class="setion-header">
        <NuxtLink :to="`/${group}`">{{ `${group?.charAt(0).toUpperCase()}${group?.slice(1)}` }}</NuxtLink>
      </div>
      <Transition name="section-expand">
        <div v-if="layoutStore.isOpen(group)">
          <slot></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.section {
  width: v-bind(width);
  padding: 1rem;
  background-color: v-bind(backgroundColor);
  box-shadow: -7px 8px 6px -3px rgba(0, 0, 0, 0.25);
  transition: transform var(--time-250) ease-in;
  z-index: v-bind(zIndex);

  &-contents {
    transition: transform var(--time-250) ease-in;
  }

  &:hover {
    transform: scaleX(1.05);
  }

  &:hover>&-contents {
    transform: scaleX(calc(1 / 1.05));
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
