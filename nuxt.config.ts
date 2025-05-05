// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  routeRules: {
    '/hello': { swr: 10 }
  },
  devServer: {
    port: 3333,
  }
})
