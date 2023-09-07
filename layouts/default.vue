<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useTitleStore } from '@/stores/title'

const themeStore = useThemeStore()
const titleStore = useTitleStore()
const route = useRoute()

// TODO: Figure out why this needs to be computed here
const title = computed(() => titleStore.title(route.path, route.params['id']))

useHead({
  // Replace the content with an apt description
  meta: [{ name: 'description', content: title }],
  bodyAttrs: {
    style: themeStore.activeThemeVariables,
  },
})
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <div class="container" id="app-host">
    <NavTheSidebar />
    <NavTheHamburgerMenu />
    <ToasterComponent />
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style>
#app-host {
  color: var(--primary-text, '#f4f4f4');
  background-color: var(--bg-color-primary, '#000');

  position: relative;
  max-width: 100vw;

  main {
    min-height: 100vh;
  }
}

.page-leave-active,
.page-enter-active {
  transition: all var(--time-300) ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0.5;
  filter: blur(4px);
}
</style>
