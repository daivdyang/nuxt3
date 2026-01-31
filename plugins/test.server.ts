import { useConfig } from "~/store/config"

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log('Nuxt plugin initialized')
  const configStore = useConfig()
  await configStore.fetchConfig()
  console.log('Config store in plugin:', configStore.config)
  nuxtApp.hook('page:start', (page) => {
    console.log('Page finished loading:', page)
  })
})
