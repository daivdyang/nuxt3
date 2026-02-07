export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userInfo = ref({
    userId: '',
    name: '',
    email: '',
    picture: ''
  })

  function getUserInfoFromStorage() {
    const storedInfo = localStorage.getItem('userInfo')
    if (storedInfo) {
      userInfo.value = JSON.parse(storedInfo)
      isLogin.value = true
    }
  }

  function setUserInfo(info: { userId: string, name: string, email: string, picture: string }) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
    isLogin.value = true
  }

  function clearUserInfo() {
    userInfo.value = {
      userId: '',
      name: '',
      email: '',
      picture: ''
    }
    localStorage.removeItem('userInfo')
    isLogin.value = false
  }

  onMounted(getUserInfoFromStorage)

  return {
    userInfo,
    isLogin,
    setUserInfo,
    clearUserInfo,
  }
})