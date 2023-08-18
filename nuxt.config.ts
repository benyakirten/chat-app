// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: [
    '@pinia/nuxt',
  ],
  postcss: {
    plugins: {
      'postcss-nested': {}
    }
  }
})
