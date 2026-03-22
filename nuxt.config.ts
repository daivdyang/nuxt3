// https://nuxt.com/docs/api/configuration/nuxt-config

const buildTime = new Date().toISOString()

export default defineNuxtConfig({
  plugins: ['~/plugins/test.server.ts'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  routeRules: {
    '/hello': { swr: 10 } // Stale-While-Revalidate: cache the page for 10 seconds, and revalidate in the background
  },

  debug: process.env.NODE_ENV === 'development', // open debug mode to see more detailed logs

  devServer: {
    port: 3333,
  },

  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      buildTime,
    }
  },

  nitro: {
    experimental: {
      websocket: true,
      tasks: true
    },
    // scheduledTasks: { "*/30 * * * * *": ['log'] } // Schedule a task to run every 30 seconds, and the task handler is defined in server/middleware/log.ts
  },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n']
})