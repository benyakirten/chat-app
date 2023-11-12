// https://nuxt.com/docs/api/configuration/nuxt-config

import { MS_IN_ONE_WEEK, MS_IN_ONE_MINUTE } from './utils/constants'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  typescript: {
    strict: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  imports: {
    dirs: ['stores'],
  },
  modules: ['@pinia/nuxt'],
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  runtimeConfig: {
    authCookieName: process.env.AUTH_COOKIE_NAME || '__auth',
    cookieSecret: process.env.COOKIE_SECRET,
    cookieExpires: parseInt(process.env.COOKIE_EXPIRES || MS_IN_ONE_WEEK.toString()),
    cookieShortExpires: MS_IN_ONE_MINUTE * 30,
    public: {
      themeCookieName: process.env.THEME_COOKIE_NAME || '__theme',
      apiUrl: process.env.API_BASE_URL,
      wsUrl: process.env.WS_URL,
    },
  },
})
