<script setup lang="ts">
const themeStore = useThemeStore()
const titleStore = useTitleStore()
const route = useRoute()
const userStore = useUsersStore()

const title = computed(() => titleStore.title(route.path, route.params['id']))
const magnification = computed(() => userStore.me?.magnification ?? 1)

onMounted(() => {
  const themeQuery = matchMedia('(prefers-color-scheme: light)')
  themeQuery.addEventListener('change', (e) => {
    const theme = e.matches ? 'day' : 'night'
    themeStore.computerTheme = theme
  })
  themeStore.computerTheme = themeQuery.matches ? 'day' : 'night'
})
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Body :style="`${themeStore.activeThemeVariables}; --magnification: ${magnification};`"></Body>
  </Head>
  <NavHeader />
  <NavTheSidebar />
  <ToasterComponent />
  <main>
    <slot></slot>
  </main>
</template>

<style>
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
  color: var(--text-color);

  --text-size-xxl: calc(var(--size-xxl) * var(--magnification, 1));
  --text-size-xl: calc(var(--size-xl) * var(--magnification, 1));
  --text-size-lg: calc(var(--size-lg) * var(--magnification, 1));
  --text-size-md: calc(var(--size-md) * var(--magnification, 1));
  --text-size-sm: calc(var(--size-sm) * var(--magnification, 1));

  font-size: var(--text-size-lg);
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
