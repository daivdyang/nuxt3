<template>
  <div>
    <h2>SSE Test</h2>
    <div class="flex gap-1">
      <button @click="startSseConnection">Start SSE Connection</button>
      <button @click="closeSseConnection">Close SSE Connection</button>
    </div>
    <div v-if="messages.length === 0">No messages received yet.</div>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'

const messages = ref<string[]>([])
const route = useRoute()
let eventSource: EventSource | null = null

function startSseConnection() {
  if (eventSource) {
    console.warn('SSE connection already established.')
    return
  }
  const queryParams = new URLSearchParams(route.query as Record<string, string>).toString()
  eventSource = new EventSource(`api/sse${queryParams ? `?${queryParams}` : ''}`, { withCredentials: true })

  eventSource.onmessage = (event) => {
    messages.value.push(event.data)
  }

  eventSource.onerror = (event) => {
    console.error('EventSource error', event)
    eventSource?.close()
    eventSource = null
  }
}

function closeSseConnection() {
  eventSource?.close()
  eventSource = null
}

onUnmounted(() => {
  eventSource?.close()
})
</script>
