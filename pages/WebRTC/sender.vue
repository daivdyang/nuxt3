<template>
  <div>
    <h1>WebRTC Sender Page</h1>
    <div>
      <h2>聊天訊息</h2>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg.message }}</li>
      </ul>
    </div>
    <input type="text" v-model="username" placeholder="用戶名" />
    <button class="rounded" @click="start">Sender to server for WebRTC</button>
    <input type="text" v-model="msg" />
    <button class="rounded" @click="sendChatMessage(msg)">Send Chat Message</button>
  </div>
  
</template>

<script setup lang="ts">
  const msg = ref('Hello from Sender!')
  const username = ref('Knock') // 可以根據需要修改為動態輸入的使用者名稱
  const messages = ref<{ username: string, type: string, message: string }[]>([]) // 用來存放聊天訊息的陣列
  let ws: WebSocket 

  // 步驟一：初始化連線與資料通道: 需要建立 RTCPeerConnection，並由發起方建立 RTCDataChannel 來處理文字。
  // 1. 設定 STUN 伺服器 (幫助取得公有 IP)
  const configuration = {
      'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
  };

  // 2. 建立 P2P 連線物件
  const peerConnection = new RTCPeerConnection(configuration);

  // 3. 建立資料通道 (僅限發起方呼叫)
  let dataChannel: RTCDataChannel;

  function prepareDataChannel() {
    // 3. 建立資料通道 (僅限發起方呼叫)
    dataChannel = peerConnection.createDataChannel("chatRoom");

    // 4. 設定資料通道的事件監聽
    dataChannel.onopen = () => {
      console.log("資料通道已開啟，可以開始聊天了！");
    };

    dataChannel.onmessage = (event) => {
      console.log("收到新訊息: ", event.data);
      // 在這裡將訊息顯示到 UI 上
      messages.value.push(JSON.parse(event.data));
    };
    // ====================================================================================================================
    // 步驟二：接收方的資料通道設定: 對於「接收方」來說，不需要手動建立通道，而是要監聽 ondatachannel 事件來接收發起方建立的通道。
    peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      
      receiveChannel.onmessage = (e) => {
          console.log("收到新訊息: ", e.data);
      };
      
      receiveChannel.onopen = () => {
          console.log("接收方的資料通道已開啟！");
      };
    };
    // ====================================================================================================================
    // 步驟三：交換網路路徑 (ICE Candidates): 當本地端找到可用的網路路徑時，必須透過「信令伺服器」傳送給對方。
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
          // [重點] 將 event.candidate 透過 WebSocket 送給信令伺服器，再轉交給對方
          sendMessageToSignalingServer({'candidate': event.candidate});
      }
    };
  }

  // 當從信令伺服器收到對方的 ICE 候選者時
  function handleRemoteCandidate(candidateData: RTCLocalIceCandidateInit) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidateData));
  }
  // ====================================================================================================================
  // 步驟四：發起連線 (Create Offer) 與答覆 (Create Answer): 這就是前面提到的「交換名片」過程。 
  // 發起方 (Caller)
  async function makeCall() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // [重點] 將 offer 透過 WebSocket 送給對方
    sendMessageToSignalingServer({'offer': offer});
  }

  // 5. 一旦雙方的 dataChannel.onopen 都觸發後，就可以自由發送文字了！
  function sendChatMessage(text: string) {
      if (dataChannel.readyState === "open") {
          dataChannel.send(JSON.stringify({ username: username.value, type: 'text', message: text, timestamp: new Date().toISOString() }));
      } else {
          console.warn("連線尚未建立！");
      }
  }

  // 接收方 (Callee) 收到 Offer 後的處理流程
  async function handleReceiveOffer(offerData: RTCSessionDescriptionInit) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offerData));
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // [重點] 將 answer 透過 WebSocket 回傳給對方
      sendMessageToSignalingServer({'answer': answer});
  }

  // 傳送訊息給信令伺服器的函式
  function sendMessageToSignalingServer(messageObj: any) {
      // 將物件轉成 JSON 字串後送出
      ws.send(JSON.stringify(messageObj));
  }

  function connectToServer() {
    // 連線到剛才建立的 WebSocket 伺服器
    ws = new WebSocket('/webrtc-signaling'); // 假設後端 WebSocket 伺服器的路徑是 /webrtc-signaling

    ws.onopen = () => {
      console.log("成功連接到信令伺服器！");
    };

    // 處理從信令伺服器收到的訊息
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.offer) {
          console.log("收到對方的 Offer，準備回覆 Answer...");
          await handleReceiveOffer(message.offer); // 呼叫上一篇寫好的接收 Offer 函式
      } 
      else if (message.answer) {
          console.log("收到對方的 Answer，連線即將建立！");
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
      } 
      else if (message.candidate) {
          console.log("收到對方的 ICE Candidate，正在加入網路路徑...");
          handleRemoteCandidate(message.candidate); // 呼叫上一篇寫好的處理 ICE 函式
      }
  };
  }

  function start() {
    prepareDataChannel();
    connectToServer();
    makeCall();
  }
</script>