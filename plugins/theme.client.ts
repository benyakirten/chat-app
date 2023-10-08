export default defineNuxtPlugin({
  name: 'set-default-theme',
  enforce: 'pre',
  hooks: {
    'app:beforeMount'() {
      // TODO: Figure out how to make sure the right theme is applied before render
      const themeStore = useThemeStore()
      const theme = themeStore.themeQuery.matches ? 'day' : 'night'

      themeStore.computerTheme = theme
    },
  },
})
