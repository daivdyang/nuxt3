export default defineWebSocketHandler({
  open(ws) {
    console.log('WebSocket connection opened', ws.id)
    ws.send('Welcome to the WebSocket server!')
  },
  message(ws, message) {
    console.log('Received message:', message.rawData, message)
    switch(message.text()) {
      case 'ping':
        ws.send('pong')
        break
        case 'time':
        ws.send(`Server time: ${new Date().toISOString()}`)
        break
      default:
        ws.send(`Echo: ${message}`)
    }
  },
  close(peer, details) {
    const { code, reason } = details
    console.log(`WebSocket connection closed: ${code} - ${reason}`, peer.id)
  }
})
