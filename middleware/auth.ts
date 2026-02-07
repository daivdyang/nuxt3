export default defineNuxtRouteMiddleware((to, from) => {
  console.log('google auth middleware', to.path)

  if (import.meta.server) {
    const cookie = useCookie('my_app_token')
    console.log('Server端需驗證 檢查cookie 內的 my_app_token 若沒有或有問題，重導到登入頁', cookie.value)
    if (!cookie.value) {
      return navigateTo('/')
    }
  }
})