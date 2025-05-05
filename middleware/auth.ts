export default defineNuxtRouteMiddleware((to, from) => {
  console.log('this is auth middleware', to.path)
  if (to.query.goto) {
    return navigateTo(to.query.goto as string)
  }
  return navigateTo(to)
})