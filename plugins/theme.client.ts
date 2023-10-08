export default defineNuxtPlugin({
  name: 'set-default-theme',
  enforce: 'pre',
  hooks: {
    'app:beforeMount'() {
      // TODO: Figure out why this is being called after render
      const themeStore = useThemeStore()
      const theme = themeStore.themeQuery.matches ? 'day' : 'night'

      themeStore.computerTheme = theme
    },
  },
})
