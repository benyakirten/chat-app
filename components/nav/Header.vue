<script setup lang="ts">
import { UsersIcon } from '@heroicons/vue/24/solid'

const mediaStore = useMediaStore()
</script>

<template>
  <header class="header">
    <div class="header-users" v-if="mediaStore.state === 'mobile'">
      <GeneralIconButton
        :icon="UsersIcon"
        title="View Conversations"
        size="2rem"
        @click="mediaStore.conversationListOpen = !mediaStore.conversationListOpen"
      />
    </div>
    <div class="header-search">
      <NavSearchBar />
    </div>
    <div class="header-hamburger">
      <NavHamburgerMenu />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  left: 0;

  z-index: var(--z-high);

  width: 100%;
  height: var(--header-height);

  --padding-edge: 4rem;

  align-items: center;
  display: grid;
  grid-template-columns: 30% 50% 1fr;
  border-bottom: 1px solid var(--accent);

  background: radial-gradient(circle, var(--bg-primary), var(--bg-alt3), var(--bg-alt5));

  &-users {
    grid-column: 1 / 2;
    padding-inline: var(--padding-edge);
  }

  &-search {
    grid-column: 2 / 3;
  }

  &-hamburger {
    grid-column: 3 / -1;
    justify-self: end;
    padding-inline: var(--padding-edge);
  }
}
</style>
