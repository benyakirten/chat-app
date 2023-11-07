import { defineStore } from 'pinia'

export interface ColorTheme {
  bgPrimary: string
  accent: string
  textColor: string
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
    // TODO: This is still terrible
    bgPrimary: '#f4f4f4',
    accent: '#e74c3c',
    textColor: '#333',
    highlight: '#3468ab',
    neutral: '#95a5a6',
    base: '#ecceab',
    mix: '#875ea0',
    opposite: '#f39c12',
  },
  night: {
    bgPrimary: '#0a192f',
    accent: '#00b894',
    textColor: '#f4f4f4',
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
  const config = useRuntimeConfig()

  const computerTheme = ref<ThemeStoreState['active']>(useCookie(config.public.themeCookieName).value as any)

  const active = computed(() => userStore.me?.theme ?? computerTheme.value)
  const activeThemeName = computed(() => (active.value === 'auto' ? computerTheme.value : active.value) ?? 'night')
  const activeTheme = computed(() => themes.value[activeThemeName.value])

  watchEffect(() => {
    if (process.server) {
      return
    }

    const cookie = useCookie(config.public.themeCookieName, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })

    cookie.value = activeThemeName.value
  })

  const activeThemeVariables = computed(() => {
    return Object.entries(themes.value[activeThemeName.value]).reduce<string>((acc, [key, value]) => {
      return `${acc} --${camelToKebabCase(key)}: ${value};`
    }, '')
  })

  return {
    themes,
    active,
    activeThemeVariables,
    computerTheme,
    activeThemeName,
    activeTheme,
  }
})
