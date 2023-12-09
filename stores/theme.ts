import { defineStore } from 'pinia'

export interface ColorTheme {
  bgPrimary: string
  accent: string
  textColor: string
  highlight: string
  colorNeutral: string
  base: string
  mix: string
  opposite: string
  bgAlt1: string
  bgAlt2: string
  bgAlt3: string
  bgAlt4: string
  bgAlt5: string
  bodyBg: string
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
    bgPrimary: '#eae7ed',
    accent: '#588157',
    textColor: '#344e41',
    highlight: '#3468ab',
    colorNeutral: '#95a5a6',
    base: '#BCC9B7',
    mix: '#3a5a40',
    opposite: '#7bbf4c',
    bgAlt1: 'color-mix(in srgb, var(--bg-primary) 95%, var(--mix))',
    bgAlt2: 'color-mix(in srgb, var(--bg-primary) 91%, var(--mix))',
    bgAlt3: 'color-mix(in srgb, var(--bg-primary) 87%, var(--mix))',
    bgAlt4: 'color-mix(in srgb, var(--bg-primary) 83%, var(--mix))',
    bgAlt5: 'color-mix(in srgb, var(--bg-primary) 79%, var(--mix))',
    bodyBg: `linear-gradient(
      to bottom left,
      var(--bg-primary) 0%,
      var(--bg-alt2) 10%,
      var(--bg-primary) 15%,
      var(--bg-alt5) 30%,
      var(--bg-primary) 65%,
      var(--bg-alt5) 95%
    )`,
  },
  night: {
    bgPrimary: '#0a192f',
    accent: '#00b894',
    textColor: '#f4f4f4',
    highlight: '#f39c12',
    colorNeutral: '#495555',
    base: '#000',
    mix: '#0082cb',
    opposite: '#00D4FF',
    bgAlt1: 'color-mix(in srgb, var(--bg-primary) 95%, var(--mix))',
    bgAlt2: 'color-mix(in srgb, var(--bg-primary) 91%, var(--mix))',
    bgAlt3: 'color-mix(in srgb, var(--bg-primary) 87%, var(--mix))',
    bgAlt4: 'color-mix(in srgb, var(--bg-primary) 83%, var(--mix))',
    bgAlt5: 'color-mix(in srgb, var(--bg-primary) 79%, var(--mix))',
    bodyBg: `linear-gradient(
      to bottom right,
      var(--bg-alt5) 5%,
      var(--bg-primary) 10%,
      var(--bg-primary) 30%,
      var(--bg-alt5) 40%,
      var(--bg-primary) 65%,
      var(--bg-alt5) 95%
    )`,
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
