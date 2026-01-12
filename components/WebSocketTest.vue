<template>
  <div>
    <h2>WebSocket Test</h2>
    <p>Status: {{ status }}</p>
    <button @click="status === 'Connected' ? disconnectWebSocket() : connectWebSocket()">{{ status === 'Connected' ? 'Disconnect WebSocket' : 'Connect WebSocket' }}</button>
    <p>Messages:</p>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <input v-model="inputMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send Message</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const status = ref('Disconnected');
const messages = ref<string[]>([]);
const inputMessage = ref('');
let socket: WebSocket | null = null;
const connectWebSocket = () => {
  socket = new WebSocket('/ws');

  socket.onopen = () => {
    status.value = 'Connected';
  };

  socket.onmessage = (event) => {
    messages.value.push(event.data);
  };

  socket.onclose = () => {
    status.value = 'Disconnected';
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};
const disconnectWebSocket = () => {
  if (socket) {
    socket.close(1000, 'Client disconnecting');
    socket = null;
  }
};
const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(inputMessage.value);
    inputMessage.value = '';
  }
};
</script>