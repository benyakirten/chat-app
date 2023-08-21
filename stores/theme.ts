import { defineStore } from 'pinia'

import { camelToKebabCase } from '@/lib/strings'

export interface ColorTheme {
  bgColorPrimary: string,
  bgColorAlt1: string,
  bgColorAlt2: string,
  bgColorAlt3: string,
  bgColorAlt4: string,
  bgColorAlt5: string,
  accent: string,
  primaryText: string,
  secondaryText: string,
  highlight: string,
  link: string,
  neutral: string,
}

export interface ThemeStore {
  themes: {
    day: ColorTheme,
    night: ColorTheme
  },
  active: 'day' | 'night'
}

// .day {
//   --accent-color: #27ae60;
//   /* --accent-color-2: #3498db; */
//   --highlight-color: #f39c12;
//   /* --highlight-color-2: #e74c3c; */

//   --neutral-color: #dcdcdc;
//   /* --neutral-color-2: #e0e0e0; */
// }

// .night {
//   --accent-color: #00b894;
//   /* --accent-color-2: #3498db; */
//   /* --acount-color-3: #e74c3c; */

//   --primary-text-color: #f4f4f4;
//   /* --primary-text-color-2: #ffffff; */
//   --secondary-text-color: #bdc3c7;

//   --highlight-color: #f39c12;
//   /* --highlight-color-2: #e74c3c; */

//   --link-color: #3498db;

//   --neutral-color: #bdc3c7;
//   /* --neutral-color-2: #e0e0e0; */
// }

const themes: ThemeStore['themes'] = {
  day: {
    bgColorPrimary: '#f4f4f4',
    bgColorAlt1: '#e0e0e0',
    bgColorAlt2: '#d2d2d2',
    bgColorAlt3: '#c4c4c4',
    bgColorAlt4: '#b6b6b6',
    bgColorAlt5: '#a8a8a8',
    accent: '#27ae60',
    primaryText: '#333333',
    secondaryText: '#777777',
    highlight: '#d32f2f',
    link: '#2980b9',
    neutral: '#dcdcdc',
  },
  night: {
    bgColorPrimary: '#0a192f',
    bgColorAlt1: '#080e1e',
    bgColorAlt2: '#071828',
    bgColorAlt3: '#05263c',
    bgColorAlt4: '#032a46',
    bgColorAlt5: '#013655',
    accent: '#00b894',
    primaryText: '#f4f4f4',
    secondaryText: '#777777',
    highlight: '#f39c12',
    link: '#3498db',
    neutral: '#bdc3c7',
  }
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeStore => ({
    themes,
    active: 'night',
  }),
  actions: {
    setTheme(theme: ThemeStore['active']) {
      this.active = theme
    }
  },
  getters: {
    activeTheme: (state) => state.themes[state.active],
    activeThemeVariables: (state) => Object.entries(state.themes[state.active]).reduce<string>((acc, [key, value]) => {
      return `${acc} --${camelToKebabCase(key)}: ${value};`
    }, "")
  }
})
