import { createEventStream } from 'h3'

export default defineEventHandler((h3event) => {
  console.log('server run api sse', h3event.node.req.url)

  const query = getQuery(h3event)
  const key = query.key || 'default'
  const max = query.max || 10

  // Create an event stream for Server-Sent Events (SSE)
  const stream = createEventStream(h3event)

  let count = 0
  stream.onClosed(() => {
    console.log(`SSE connection closed by client, key:${key}, count:${count}`)
    clearInterval(interval)
  })

  // Send a message every 5 seconds
  const interval = setInterval(() => {
    if (count >= Number(max)) {
      clearInterval(interval)
      stream.close()
      return
    }

    const data = `Current [${key}] Count: ${count++}`
    console.log('Sending SSE message:', data)
    stream.push({ id: (count * 10).toString(), event: 'message', data, retry: 3000 }) // retry: 3000 means if connection lost, client will try to reconnect after 3 seconds
  }, 1000)

  return stream.send()
})