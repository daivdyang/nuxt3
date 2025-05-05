<template>
  <div>
    <NuxtLayout>
      <div>
        <p>Count: {{ counter }}</p>
        <button @click="handleClick">Increment</button>
      </div>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
// console.log('start run app.vue....')
// await new Promise((res) => setTimeout(res, 3000))
// console.log('after 3s')
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
const counter = ref(888); // executes in server and client environments

const handleClick = () => {
  counter.value++; // executes only in a client environment
};
</script>
<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>