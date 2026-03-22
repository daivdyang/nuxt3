export default defineEventHandler(async (h3) => {
  console.log('***[log middleware]***', `[${h3.node.req.method}]`,h3.node.req.url)
  const query = getQuery(h3)
  if (typeof query.delay === 'string' && Number(query.delay) > 0) {
    const delay = Number(query.delay)
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[log middleware] Delayed for ${delay} seconds`)
        resolve(true)
      }, delay * 1000)
    })
  }
})