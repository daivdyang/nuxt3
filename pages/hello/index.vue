<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>

<template>
  <div>This is Hello Page</div>
  <pre>{{ data }}</pre>
  <NuxtLink to="/about">About page</NuxtLink>
  <NuxtLink to="/counter">Counter page</NuxtLink>
</template>