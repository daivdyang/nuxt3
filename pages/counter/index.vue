<template>
  <h4>This is Counter Page</h4>
  <button  @click="show = !show">Show LazyComp1</button>
  <Suspense @fallback="handleEvent('fallback')" @resolve="handleEvent('resolve')" @pending="handleEvent('pending')">
    <ServerComp1 />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <LazyCounterComp1 :hydrate-after="5000" />
  <NuxtLink to="/ws_test">Go to Websocket Page</NuxtLink>
  <NuxtLink to="/about">Go to About Page</NuxtLink>
</template>
<script setup lang="ts">
const show = ref(false)

const resHeader = useResponseHeader('x-from-counter')
resHeader.value = 'counter-page'
function handleEvent(type: string) {
  console.log(`trigger ${type}`, resHeader.value)
}
</script>