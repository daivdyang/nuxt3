<template>
  <div>
    <h2>Config Test</h2>
    <pre>{{ configStore.config }}</pre>
  </div>
</template>
<script setup lang="ts">
import { useConfig } from "~/store/config"
const configStore = useConfig()
</script>