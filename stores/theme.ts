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
  const active = ref<ThemeStoreState['active']>('night')

  function setTheme(theme: ThemeStoreState['active']) {
    active.value = theme
  }

  const activeTheme = computed(() => themes.value[active.value])
  const activeThemeVariables = computed(() =>
    Object.entries(themes.value[active.value]).reduce<string>((acc, [key, value]) => {
      return `${acc} --${camelToKebabCase(key)}: ${value};`
    }, '')
  )

  return { themes, active, setTheme, activeTheme, activeThemeVariables }
})
