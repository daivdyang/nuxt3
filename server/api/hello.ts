export default defineEventHandler((e) => {
  console.log('server run hello api', e.node.req.url)
  return {
    hello: 'world'
  }
})