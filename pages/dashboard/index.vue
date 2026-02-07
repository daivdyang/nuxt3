<template>
  <div>
    <h1>Dashboard</h1>
    <div>這是 Dashboard 頁面，只有登入後才能看到。</div>
    <div>
      <GoogleLoginBtn />
    </div>
    <div class="flex">
      <div>使用者名稱: {{ userInfo.name }}</div>
      <div>使用者 Email: {{ userInfo.email }}</div>
      <div>使用者 ID: {{ userInfo.userId }}</div>
      <div>使用者頭像: <img :src="userInfo.picture" alt="User Avatar" /></div>
      <NuxtLink to="/">回到首頁</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/user';

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore();
const { userInfo} = storeToRefs(userStore)

</script>