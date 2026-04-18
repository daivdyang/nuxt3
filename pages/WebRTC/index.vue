<template>
  <div>
    <h1>WebRTC P2P 聊天室</h1>
    <div>{{ `連線狀態: ${status}` }}</div>
    <input type="text" v-model="username" placeholder="用戶名" />
     <div>
       <h2>聊天訊息</h2>
       <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.username}: ${msg.message}` }}</li>
      </ul>
     </div>
     <div>
      <fieldset v-if="!isWebRTCConnected" class="setting">
        <input type="radio" id="sender" value="sender" v-model="type">
        <label for="sender">Sender</label>
        <input type="radio" id="receiver" value="receiver" v-model="type">
        <label for="receiver">Receiver</label>
        <button class="rounded" @click="initWebSocket" :disabled="!type">Start WebRTC</button>
      </fieldset>
     </div>

     <div class="sender">
       <input type="text" v-model="msg" />
       <button class="rounded" :disabled="!isWebRTCConnected" @click="sendMessage">Send Chat Message</button>
     </div>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'

// --- WebRTC 全域變數 ---
let peerConnection: RTCPeerConnection;
let dataChannel: RTCDataChannel;
const config = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }; // 使用 Google 的 STUN 伺服器
let ws: WebSocket;

const type = ref<'sender' | 'receiver'>('receiver') // 預設為接收方
const status = ref('尚未連線')
const isWebRTCConnected = ref<boolean>(false)
const username = ref('Knock') // 可以根據需要修改為動態輸入的使用者名稱
const messages = ref<{ username: string, type: string, message: string, timestamp: string }[]>([]) // 用來存放聊天訊息的陣列
const msg = ref('Hello from Receiver!')

function initWebSocket() {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket('/webrtc-signaling');
    status.value = "開始連接到信令伺服器...";
    ws.onopen = () => {
        console.log("成功連接到信令伺服器！");
        status.value = "已連接到信令伺服器，等待 P2P 連線...";
        initWebRTC();
    };

    ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("從信令伺服器收到訊息: ", message);

        if (message.offer) {
            // 這裡是接收對方的 Offer，並設定為遠端描述
            console.log("收到 Offer", message.offer);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            ws.send(JSON.stringify({ 'answer': answer }));
        } 
        else if (message.answer) {
            // 這裡是接收對方的 Answer，並設定為遠端描述
            console.log("收到 Answer", message.answer);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
        } 
        else if (message.candidate) {
            // 這裡是接收對方的 ICE Candidate，並加入到 PeerConnection 中
            console.log("收到 ICE Candidate", message.candidate);
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else {
            console.warn("收到未知類型的訊息: ", message);
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket 發生錯誤: ", error);
        status.value = "與信令伺服器的連線發生錯誤";
    };

    ws.onclose = () => {
        console.log("與信令伺服器的連線已關閉");
        status.value = "與信令伺服器的連線已關閉";
        isWebRTCConnected.value = false;
    };
}



// --- 2. WebRTC 初始化 ---
function initWebRTC() {
    peerConnection = new RTCPeerConnection(config);
    if (type.value === 'sender') {
        dataChannel = peerConnection.createDataChannel("chat");
        setupDataChannel(dataChannel);
        makeOffer(); // 發起連線
    }
    // 處理尋找到的本地 ICE Candidate
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("找到新的 ICE Candidate: ", event.candidate);
            // 將 event.candidate 透過 WebSocket 送給信令伺服器，再轉交給對方
            ws.send(JSON.stringify({ 'candidate': event.candidate }));
        }
    };
    // 監聽接收方的 DataChannel 事件
    peerConnection.ondatachannel = (event) => {
        console.log("收到對方建立的 DataChannel: ", dataChannel, type.value);
        if (type.value === 'receiver') {
            dataChannel = event.channel;
            setupDataChannel(dataChannel);
        }
    };
}

// --- 3. 設定資料通道行為 ---
function setupDataChannel(channel: RTCDataChannel) {
    channel.onopen = () => {
        status.value = "P2P 連線已建立，可以開始聊天！";
        isWebRTCConnected.value = true;
    };
    channel.onmessage = (event) => {
        console.log("收到新訊息: ", event.data);
        // 在這裡將訊息顯示到 UI 上
        messages.value.push(JSON.parse(event.data));
    };
}

// --- 4. 處理 ICE Candidate 的交換: 當本地端找到可用的網路路徑時，必須透過「信令伺服器」傳送給對方。
async function makeOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    // 將 offer 透過 WebSocket 送給對方
    ws.send(JSON.stringify({'offer': offer}));
}

// --- 5. 傳送訊息邏輯 ---
function sendMessage() {
    const text = msg.value.trim();
    if (text && dataChannel && dataChannel.readyState === 'open') {
        const msgObj = { username: username.value, type: 'text', message: text, timestamp: new Date().toISOString() }
        dataChannel.send(JSON.stringify(msgObj));
        messages.value.push(msgObj);
        msg.value = '';
    }
}
</script>

<style scoped>
.setting {
  max-width: 400px;
  display: flex;
  gap: 1rem;
  place-items: center;
  padding: 2rem;
}

.sender {
  margin: 1rem;
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
</style>