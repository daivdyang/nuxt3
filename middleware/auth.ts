export default defineNuxtRouteMiddleware((to, from) => {
  console.log('google auth middleware', to.path)

  if (import.meta.server) {
    const cookie = useCookie('my_app_token')
    console.log('[Server端Middleware]')
    if (!cookie.value) {
      console.log('沒有token，導向首頁')
      return navigateTo('/')
    }
  }

  if (import.meta.client) {
    console.log('[Client端需驗證]')
  }
})