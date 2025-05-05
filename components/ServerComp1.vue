<template>
  <div>
    <h4>Run on Server side</h4>
    <div>
      Counter: {{ counter }}
      <button @click="counter++">
        +
      </button>
      <button @click="counter--">
        -
      </button>
    </div>
    <div>{{ $route.params.group }} - {{ $route.params.id }}</div>
  </div>
</template>
<script setup lang="ts">
console.log('start run ServerComp1.vue....')
await new Promise((res) => setTimeout(res, 3000))
console.log('after 3s')
const counter = useState('counter', () => {
  const rndNumber = Math.round(Math.random() * 1000)
  console.log('rndNumber', rndNumber)
  return rndNumber
})
</script>