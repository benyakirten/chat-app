// https://nuxt.com/docs/api/configuration/nuxt-config

const MS_IN_ONE_DAY = 1_000 * 60 * 60 * 24
const MS_IN_ONE_WEEK = MS_IN_ONE_DAY * 7

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
    refreshCookieName: process.env.REFRESH_COOKIE_NAME || '__session',
    rememberMeCookieName: process.env.REMEMBER_ME_COOKIE_NAME || '__remember_me',
    cookieSecret: process.env.COOKIE_SECRET || 'secret',
    cookieExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || MS_IN_ONE_DAY.toString()),
    cookieRememberMeExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || MS_IN_ONE_WEEK.toString()),
  },
})
