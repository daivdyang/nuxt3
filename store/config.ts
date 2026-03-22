export const useConfig = defineStore('config', () => {
  const config = ref<{a: string, b: string, c: number[], d: {x: number, y: number}}>()

  async function fetchConfig() {
    try {
      const headers = useRequestHeaders(['cookie', 'user-agent'])
      console.log('Fetching "config" with headers:', headers)
      const data = await $fetch<{a: string, b: string, c: number[], d: {x: number, y: number}}>('/api/config', { headers })
      config.value = { ...config.value, ...data }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  return { config, fetchConfig }
})
