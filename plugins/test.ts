export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', (page) => {
    console.log('Page finished loading:', page)
  })
})
