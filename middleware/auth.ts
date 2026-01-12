export default defineNuxtRouteMiddleware((to, from) => {
  const resHeader = useResponseHeader('x-from-counter')
  resHeader.value = 'counter-page'
  console.log('this is auth middleware', to.path)
  if (to.query.goto) {
    return navigateTo(to.query.goto as string)
  }
  return navigateTo('/')
})