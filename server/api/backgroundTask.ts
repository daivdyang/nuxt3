export default defineEventHandler((h3Event) => {
  console.log('server run api backgroundTask', h3Event.node.req.url)

  h3Event.waitUntil(new Promise((resolve) => {
    setTimeout(() => {
      console.log('background task executed after 5 seconds')
      resolve(true)
    }, 3000)
  }))

  h3Event.node.res.on('close', () => {
    console.log('response closed, but background task may still running...')
  })
  h3Event.node.res.on('finish', () => {
    console.log('response finished, but background task may still running...')
  })

  return {
    message: 'background task executed'
  }
})