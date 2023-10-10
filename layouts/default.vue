<script setup lang="ts">
const themeStore = useThemeStore()
const titleStore = useTitleStore()
const route = useRoute()
const userStore = useUsersStore()

const title = computed(() => titleStore.title(route.path, route.params['id']))
const magnification = computed(() => userStore.me?.magnification ?? 1)
</script>

<template>
  <Head>
    <Html :style="`--magnification: ${magnification}`"></Html>
    <Title>{{ title }}</Title>
    <Body :style="`${themeStore.activeThemeVariables};`"></Body>
  </Head>
  <NavHeader />
  <NavTheSidebar />
  <ToasterComponent />
  <main>
    <slot></slot>
  </main>
</template>

<style>
html {
  font-size: calc(var(--base-size) * var(--magnification, 1));
}

body {
  --bg-alt1: color-mix(in srgb, var(--bg-primary) 95%, var(--mix));
  --bg-alt2: color-mix(in srgb, var(--bg-primary) 91%, var(--mix));
  --bg-alt3: color-mix(in srgb, var(--bg-primary) 87%, var(--mix));
  --bg-alt4: color-mix(in srgb, var(--bg-primary) 83%, var(--mix));
  --bg-alt5: color-mix(in srgb, var(--bg-primary) 79%, var(--mix));
  --box-shadow-color: color-mix(in srgb, var(--accent) 25%, transparent);

  --body-bg: linear-gradient(
    to bottom right,
    var(--bg-alt5) 5%,
    var(--bg-primary) 10%,
    var(--bg-primary) 30%,
    var(--bg-alt5) 40%,
    var(--bg-primary) 65%,
    var(--bg-alt5) 95%
  );

  background: var(--body-bg);
  color: var(--text);

  font-size: var(--size-lg);
}

main {
  min-height: 100vh;
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
