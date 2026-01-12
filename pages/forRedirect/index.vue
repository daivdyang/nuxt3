<template>
  <div>
    <h4>This is For Redirect Page</h4>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: [
    // function(to, from) {
    //   console.log('this inline middleware', to.path)
    //   if (to.query.goto) {
    //     // await new Promise((res) => setTimeout(res, 3000))
    //     console.log('url:', to.query.goto)
    //     // return navigateTo(to)
    //     return 
    //   }
    //   return navigateTo('/about')
    // },
    'auth'
  ]
})
</script>