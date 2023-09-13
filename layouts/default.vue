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
    <NavHeader />
    <NavTheSidebar />
    <ToasterComponent />
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style>
body {
  --bg-alt1: color-mix(in srgb, var(--bg-primary) 95%, var(--mix));
  --bg-alt2: color-mix(in srgb, var(--bg-primary) 91%, var(--mix));
  --bg-alt3: color-mix(in srgb, var(--bg-primary) 87%, var(--mix));
  --bg-alt4: color-mix(in srgb, var(--bg-primary) 83%, var(--mix));
  --bg-alt5: color-mix(in srgb, var(--bg-primary) 79%, var(--mix));
}

#app-host {
  color: var(--text, '#f4f4f4');
  background-color: var(--bg-primary, '#000');

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
