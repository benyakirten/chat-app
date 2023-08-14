// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
