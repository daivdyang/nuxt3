export default defineEventHandler((e) => {
  console.log('server run config api', e.node.req.url)
  return {
    a:"aaa",
    b: "bbb",
    c: [1,2,3],
    d: {x: 10, y:20}
  }
})
