<script setup lang="ts">
const themeStore = useThemeStore()
const titleStore = useTitleStore()
const route = useRoute()

const title = computed(() => titleStore.title(route.path, route.params['id']))

useHead({
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
    height: 100vh;
  }
}

.page-leave-active,
.page-enter-active {
  transition: all 300ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0.5;
  filter: blur(4px);
}
</style>
