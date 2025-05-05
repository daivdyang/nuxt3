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
</template>
<script setup lang="ts">
const show = ref(false)

function handleEvent(type: string) {
  console.log(`trigger ${type}`)
}
</script>