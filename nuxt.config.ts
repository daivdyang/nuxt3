// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: ['~/plugins/test.ts'],
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
  },
  nitro: {
    experimental: {
      websocket: true,
      tasks: true
    },
    scheduledTasks: { "*/30 * * * * *": ['log'] }
  }
})
