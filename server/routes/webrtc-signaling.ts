import type { Peer, AdapterInternal } from "crossws";

const clients = new Map<string, Peer<AdapterInternal>>()

export default defineWebSocketHandler({
  open(ws) {
    console.log('WebSocket connection opened', ws.id)
    console.log("一位新使用者已連線！");
    clients.set(ws.id, ws);
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' }));
  },
  message(ws, message) {
    console.log('Received message:', message.rawData, message)
    // 將 Buffer 轉為字串
    const dataString = message.text();
    console.log("收到信令資料: ", dataString);
    // 核心邏輯：廣播 (Broadcast)
    // 將收到的訊息轉發給「除了發送者本人以外」的所有已連線使用者
    clients.forEach((client) => {
        if (client.id !== ws.id && client.websocket.readyState === WebSocket.OPEN) {
            client.send(dataString);
        }
    });
  },
  close(peer, details) {
    const { code, reason } = details
    console.log(`WebSocket connection closed: ${code} - ${reason}`, peer.id)
    console.log("一位使用者已斷線！");
    clients.delete(peer.id);
  }
})
