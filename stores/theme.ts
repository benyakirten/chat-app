import { defineStore } from 'pinia'

export interface ColorTheme {
  bgPrimary: string
  accent: string
  text: string
  highlight: string
  neutral: string
  base: string
  mix: string
  opposite: string
}

export interface ThemeStoreState {
  themes: {
    day: ColorTheme
    night: ColorTheme
  }
  active: 'day' | 'night'
}

const defaultThemes: ThemeStoreState['themes'] = {
  day: {
    bgPrimary: '#f4f4f4',
    accent: '#27ae60',
    text: '#333333',
    highlight: '#d32f2f',
    neutral: '#dcdcdc',
    base: '#fff',
    mix: '#000',
    opposite: '#000',
  },
  night: {
    bgPrimary: '#0a192f',
    accent: '#00b894',
    text: '#f4f4f4',
    highlight: '#f39c12',
    neutral: '#495555',
    base: '#000',
    mix: '#0082cb',
    opposite: '#00D4FF',
  },
}

export const useThemeStore = defineStore('theme', () => {
  const themes = ref(defaultThemes)
  const userStore = useUsersStore()

  const themeQuery = globalThis.matchMedia?.('(prefers-color-scheme: light)')
  const computerTheme = ref<ThemeStoreState['active']>(themeQuery?.matches ? 'day' : 'night')
  themeQuery?.addEventListener('change', (e) => (computerTheme.value = e.matches ? 'day' : 'night'))
  const active = computed(() => userStore.me?.colorTheme ?? computerTheme.value)

  const activeThemeVariables = computed(() => {
    const theme = active.value === 'auto' ? computerTheme.value : active.value
    return Object.entries(themes.value[theme]).reduce<string>((acc, [key, value]) => {
      return `${acc} --${camelToKebabCase(key)}: ${value};`
    }, '')
  })

  return { themes, active, activeThemeVariables, computerTheme, themeQuery }
})
