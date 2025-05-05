<template>
  <section>
    <p>This page will be displayed at the /about route.</p>
    <NuxtLink to="/hello">Hello page</NuxtLink>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'orange'
})
</script>