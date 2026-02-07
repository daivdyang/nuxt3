<template>
  <div v-show="!userStore.isLogin" id="googleButtonDiv" data-auto_select="false">Login with Google</div>
  <button v-show="userStore.isLogin" @click="handleLogout">Logout Google</button>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'

useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      defer: true
    }
  ]
})

const userStore = useUserStore()
const config = useRuntimeConfig()

// 初始化 Google Sign-In 按鈕
async function initGoogleSignIn() {
  // @ts-ignore
  window.google.accounts.id.initialize({
    client_id: config.public.googleClientId,
    callback: handleCredentialResponse, // 指定 callback 函數
    auto_select: false, // 是否自動選擇帳號
    cancel_on_tap_outside: true
  })

  // @ts-ignore
  window.google.accounts.id.renderButton(
    document.getElementById("googleButtonDiv"),
    { 
      theme: "outline", 
      size: "large",
      text: "sign_in_with", // 按鈕文字類型
      shape: "rectangular",
      logo_alignment: "left"
    }
  )
}

// 處理 Google 回傳的 Credential
async function handleCredentialResponse(response: any) {
  console.log("Encoded JWT ID token: " + response.credential, response);
  // response.credential 是 Google 回傳的 JWT Token，裡面包含使用者資訊
  // {
  //   "clientId": "xxx.apps.googleusercontent.com",
  //   "client_id": "xxx.apps.googleusercontent.com",
  //   "credential": "{Google JWT Token}",
  //   "select_by": "btn"
  // }

  // 將 Token 發送至後端 API
  try {
    const data = await $fetch('/api/googleOAuth2/callback', {
      method: 'POST',
      body: {
        token: response.credential
      }
    })
    if (data.success && data.user) {
      console.log('後端驗證成功:', data)
      // 登入成功後的轉導或狀態存儲
      userStore.setUserInfo(data.user)
      navigateTo('/dashboard') 
    } else {
      console.error('後端驗證失敗:')
    }
  } catch (err) {
    console.error('請求錯誤:', err)
    alert('登入失敗，請稍後再試')
  }
}

// 登出 google 帳號
async function handleLogout () {
  // 1. (選用) 呼叫後端登出 API，如果是使用 HttpOnly Cookie 則必須做這步
  /* await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) 
  */

  // 2. 清除前端儲存的 Token 或 User 資訊
  const tokenCookie = useCookie('auth_token') // 假設 Token 存在 Cookie
  tokenCookie.value = null // 清除 Cookie
  loginInfo.value = '未登入'

  // 3. 通知 Google 取消自動選取
  // 確保 window.google 已載入
  // @ts-ignore
  if (window.google && window.google.accounts) {
    // @ts-ignore
    window.google.accounts.id.disableAutoSelect()
    console.log('Google Auto Select Disabled')
    isLogin.value = false
  }

  // 4. 轉導回登入頁面或其他頁面
}

// 希望登出時，連同「使用者授權給您 App 的權限」都一起斷開（下次登入時需要重新同意授權畫面）
// 通常不需要做到這一步，除非使用者是選擇「刪除帳號」或「取消連結」
function revokeAccess(userEmail: string) {
  // @ts-ignore
  if (window.google && window.google.accounts) {
    // @ts-ignore
    window.google.accounts.id.revoke(userEmail, (done) => {
      console.log('Access revoked', done)
      console.log(done.error)
    })
  }
}

onMounted(() => {
  // 定義一個檢查 Google SDK 是否載入的函數
  const checkGoogleLoaded = setInterval(() => {
    // @ts-ignore
    if (window.google && window.google.accounts) {
      clearInterval(checkGoogleLoaded)
      initGoogleSignIn()
    }
  }, 100) // 每 100ms 檢查一次
})
</script>